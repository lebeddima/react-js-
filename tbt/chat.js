import React, { Component } from 'react';
import defaultPhoto from '../../../assets/img/default_photo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTimes, faFile, faTrashAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import connect from "react-redux/es/connect/connect";
import { bindActionCreators } from "redux";
import io from 'socket.io-client';
import { addMessage } from '../../../actions/user/addMessage';
import sendIcon from '../../../assets/img/send-message.svg';

const { detect } = require('detect-browser');
const browser = detect();

let user_id = false,
    broker_id,
    socket;

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      brokerTime: 'offline',
      messageText: '',
      messageTextFile: '',
      messages: [],
      file: '',
      isBrokerTyping: false,
      brokerStatus: '',
      rows: 1,
      minRows: 1,
      maxRows: 4,
      chatData: false,
    }
  }

  connections() {
    const { data } = this.props;

    console.log('data: ', data);
    console.log('chatData: ', this.state.chatData);

    if (data.id !== undefined && !this.state.chatData && user_id !== data.id) {
      this.setState({chatData: true});

      console.log('type=chat&broker_id=' + broker_id + '&user_id=' + user_id);
      console.log(process.env.REACT_APP_SOCKET_HOST);

      user_id = data.id;
      broker_id = data.broker.id;
      socket = io(process.env.REACT_APP_SOCKET_HOST, {
        query : 'type=chat&broker_id=' + broker_id + '&user_id=' + user_id
      });
    } else {
      console.log('empty returnd');
      return;
    }

    socket.on('chat message', response => {
      console.log('chat message', response);
      console.log('this.state: ', this.state);

      this.props.addMessage(response);
      this.scrollToBottom();
      this.setState({...this.state, isBrokerTyping: false});

      if(response.user_id !== user_id && this.props.chatClass !== 'active') {
        this.props.setActiveBtn();
      }
    });

    socket.on('brokerOnline', () => {
      this.setState({brokerStatus: 'online', brokerTime: 'online'});
    });

    socket.on('brokerOffline', response => {
      this.setState({brokerStatus: '', brokerTime: response.last_activity});
    });

    socket.on('typing user', () => {
      if(!this.state.isBrokerTyping) {
        this.setState({...this.state, isBrokerTyping: true});

        setTimeout(() => {
          this.setState({...this.state, isBrokerTyping: false});
        }, 2000)
      }
      
      this.scrollToBottom();
    })
  }

  componentWillUnmount() {
    if (socket) {
      console.log('componentWillUnmount: disconnect');
      socket.emit('disconnect');
      socket.close();
    }

    if (this.state.chatData) {
      this.setState({chatData: false});
    }
  }

  setMessages = () => {
    console.log('setMessages');
    const { data } = this.props;

    if(!data.messages) return;

    const messages = data.messages;

    if(messages.length) {
      return messages.map((item, index) => {
        let isSelfMessage = user_id === item.user_id ? 'right' : 'left';

        this.scrollToBottom();

        return (
          <div key={index} className={`messege__wrap__${isSelfMessage}`}>
            {
              item.file ?
              <div className="messege messege">
                <div className="messege__content">
                  <a className="messege__content__file" href={item.file} download={item.file_name}>
                    <div className="icon">
                        <FontAwesomeIcon 
                          icon={faDownload}
                          className="download"
                        />
                        <FontAwesomeIcon 
                          icon={faFile}
                          className="file"
                        />
                    </div>
                    <div className="ml10 file__info__container__w">
                      <div className="name">{item.file_name}</div>
                      <div className="size">
                        {
                          Number.isInteger(item.file_size) 
                          ?
                          this.handleSizeFile(item.file_size)
                          :
                          item.file_size
                        }
                      </div>
                    </div>
                  </a>
                  <p className="mt10">{item.message}</p>
                </div>
                <div className="messege__date">
                  {item.time_created}
                </div>
              </div>
              :
              <div className="messege messege">
                <div className="messege__content">
                  <p>{item.message}</p>
                </div>
                <div className="messege__date">
                  {item.time_created}
                </div>
              </div>
            }
          </div>
        )
      })
    } else {
      return (
        <span className="no-content">Повідомлень поки немає...</span>
      )
    }
  };

  sendMessage = () => {
    console.log('sendMessage');
    const { showToast } = this.props;
    const { messageText } = this.state;

    if(this.state.messageText.length <= 1) {
      showToast('error', 'Повідомлення повинно бути більше одного символа');

      return;
    }

    let data = {
      user_id: user_id,
      chat_id: user_id,
      broker_id: broker_id,
      message: messageText
    };

    console.log('sendMessage break point 2');
    console.log(data);

    socket.emit('chat message', data);
    
    setTimeout(() => {
      this.refs.messageInput.value = '';
      this.setState({messageText: '', rows: 1});
    }, 1)
    
  };

  sendMessageWithFile = () => {
    const { messageTextFile, file } = this.state;
    const file_name = file[0].name;
    const file_size = file[0].size;
    const reader = new FileReader();
    let data;
 
    reader.readAsDataURL(file[0]);

    reader.onloadend = () => {
      data = {
        user_id: user_id,
        chat_id: user_id,
        broker_id: broker_id,
        message: messageTextFile,
        file: reader.result,
        file_name: file_name,
        file_size: file_size
      };

      socket.emit('chat message', data);

      this.clearFileArea();
    };
  };

  scrollToBottom = () => {
    const { chatContainer } = this.refs;

    if(!chatContainer) return;

    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  handleInput = (event) => {
    let length = event.target.value.length,
        maxNum = 160,
        value = event.target.value,
        maxRate = length - maxNum,
        areaName = event.target.name;

    if(length > maxNum) {
      this.props.showToast('error', 'Повідомлення може мiстити максимум 160 символiв');
      if(areaName === 'messageTextFile') {
        this.refs.textFileInput.value = value.substring(0, value.length - maxRate);
      } else if(areaName === 'messageText') {
        this.refs.messageInput.value = value.substring(0, value.length - maxRate);
      }
    
      return;
    }

    this.setState({[event.target.name]: event.target.value});

    socket.emit('typing user', {user_id: user_id});

    if(event.target.name !== 'messageText') return;
    this.autoResize(event);
  };

  handleFileInput = (event) => {
    this.setState({[event.target.name]: event.target.files});
  };

  handleKeyDown = (e) => {
    if(e.keyCode === 13 && !e.shiftKey) {
      this.sendMessage();
    }
  };

  handleFileInputKeyDown = (e) => {
    if(e.keyCode === 13) {
      this.sendMessageWithFile();
    }
  };

  autoResize = (event) => {
		const textareaLineHeight = 22;
		const { minRows, maxRows } = this.state;
		
		const previousRows = event.target.rows;
  	event.target.rows = minRows;
		
		const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);
    
    if (currentRows === previousRows) {
    	event.target.rows = currentRows;
    }
		
		if (currentRows >= maxRows) {
			event.target.rows = maxRows;
			event.target.scrollTop = event.target.scrollHeight;
		}
    
  	this.setState({
      rows: currentRows < maxRows ? currentRows : maxRows,
    });
  };

  handleSizeFile = size => {
    if(size < 1000000){
      return Math.floor(size / 1000) + 'KB';
    } else{
      return Math.floor(size / 1000000) + 'MB';
    }
  };

  clearFileArea = () => {
    const { fileInput, textFileInput } = this.refs;

    this.setState({file: '', messageTextFile: ''});
    fileInput.value = '';
    textFileInput.value ='';
  };

  setBrokerLastActivity = () => {
    const { brokerTime } = this.state;
    const { data } = this.props;

    if(!data.broker) return;

    let fullDate = JSON.parse(data.broker.last_activity);

    if(brokerTime !== 'offline') {
      return (
        <span className="last__online">
          Last seen {brokerTime.date} at {brokerTime.time}
        </span>
      )
    } else {
      return (
        <span className="last__online">
          Last seen {fullDate.date} at {fullDate.time}
        </span>
      )
    }
  };

  render() {
    const { isBrokerTyping, file } = this.state;
    const { chatClass, closeChat, data } = this.props;
    let safariAgent = browser.name.toLocaleLowerCase() === 'safari' || browser.name.toLocaleLowerCase() === 'ios' ;
    const chatBodyStyle = window.innerWidth <= 768 ? {
      height: `calc(${safariAgent ? 89 : 100 }vh - 80px - 90px - 72px - ${safariAgent ? 20 : 0}px)`,
      maxHeight: `calc(${safariAgent ? 89 : 100 }vh - 80px - 90px - 72px - ${safariAgent ? 20 : 0}px)`,
      minHeight: `calc(${safariAgent ? 89 : 100 }vh - 80px - 90px - 72px - ${safariAgent ? 20 : 0}px)`
    } : null;
    const chatContainerStyle = window.innerWidth <= 768 ?  {
      height: '100%',
    maxHeight: '100% ',
    minHeight: '100% '
    } : null;
      return (
          <div className={`personal__chat persolan-area__conteiner ${chatClass}`}>
            <div className="personal__chat__header">
              <FontAwesomeIcon 
                className="close-btn" 
                icon={faTimes}
                onClick={closeChat}
              />
              <span className="text">Онлайн чат з брокером</span> 
            </div>
          <div className="">
            <div className="personal__chat__head">
              <div className="personal__chat__head__avatar">
                  <div className="avatar">
                    {/*<div className={`status ${brokerStatus}`}/>*/}
                    <img src={data.broker ? data.broker.imageUrl : defaultPhoto} alt="chat_user"/>
                  </div>
                  <div className="avatar__desc">
                    {
                      data.broker &&
                      <span className="name">{data.broker.name}</span>
                    }
                    {/*{*/}
                    {/*  brokerTime !== 'online' */}
                    {/*  ?*/}
                    {/*    this.setBrokerLastActivity()*/}
                    {/*  :*/}
                    {/*    <span className="last__online">{brokerTime}</span>*/}
                    {/*}*/}
                    
                  </div>
              </div>
            </div>
            <div className="personal__chat__body" style={chatBodyStyle}>
              <div className="chat__container" style={chatContainerStyle} ref="chatContainer">
                {this.connections()}
                {this.setMessages()}
                {
                  isBrokerTyping &&
                  <div className='messege__wrap__left'>
                    <div className="messege messege">
                      <div className="messege__content">
                        <div className="wave__dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div className="type__messege__container">
                <div className="type__messege__wrap lead emoji-picker-container">
                  <textarea
                    rows={this.state.rows}
                    ref='messageInput' 
                    className="type__text" 
                    placeholder="Введіть Ваше повідомлення…" 
                    name="messageText"
                    onChange={this.handleInput}
                    onKeyDown={this.handleKeyDown}
                    onFocus={this.scrollToBottom}
                  />
                </div>
                <div className="upload pointer parent mr20">
                    <FontAwesomeIcon icon={faPaperclip}/>
                    <input 
                      id="fileInput" 
                      hidden 
                      type="file" 
                      name="file"
                      ref="fileInput"
                      onChange={this.handleFileInput}
                    />
                    <label htmlFor="fileInput"/>
                </div>
                <button type="button" onClick={this.sendMessage} className="send__messege">
                  <svg className="svg-send-message-dims">
                    <use xlinkHref="#send-message"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className={`personal__chat__file__overflow ${Object.keys(file).length ? 'active' : ''}`}>
            <div className="personal__chat__file--container">
              <div className="row space-between align-center">
                  <span className="file__container__name">Додавання файлу</span>
                  <FontAwesomeIcon 
                    className="close__btn" 
                    icon={faTimes}
                    onClick={this.clearFileArea}
                   />
              </div>
              { 
                  Object.keys(file).length &&
                  <div className="row space-between align-center mt20">
                    <div className="row align-center">
                      <div className="file__icon">
                        <FontAwesomeIcon 
                          color="#E7E7E7" 
                          icon={faFile}
                         />
                      </div>
                      <div className="file__info">
                        <div title={file[0].name} className="name">{file[0].name}</div>
                        <div className="size">{this.handleSizeFile(file[0].size)}</div>
                      </div>
                    </div>
                    <FontAwesomeIcon 
                      color="#6D6D6D" 
                      icon={faTrashAlt}
                      className="pointer"
                      onClick={this.clearFileArea}
                     />
                  </div>
              }
              <div className="file__container__text__area">
                <input
                  name="messageTextFile"
                  placeholder="Додати підпис ..."
                  ref="textFileInput" 
                  onChange={this.handleInput}
                  onKeyDown={this.handleFileInputKeyDown}
                />
                <img 
                  src={sendIcon} 
                  alt="send-message"
                  onClick={this.sendMessageWithFile}
                />
              </div>
            </div>
          </div>
        </div>
      )
  }
};

function matchDispatchToProps(dispath) {
  return bindActionCreators(
      {
          addMessage,
      }, dispath);
};

function mapStateToProps(state) {
  return {
      data: state.user.userData,
  }
};

export default connect(mapStateToProps, matchDispatchToProps)(Chat);