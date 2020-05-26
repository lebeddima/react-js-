import React, { Component } from 'react'
import { GoogleMap, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import Geocode from "react-geocode";
import { connect } from "react-redux";
import { isMobile } from 'react-device-detect';

class Map extends Component {
    state = {
        isShowWindow: 0,
        item: {},
        rendered_loc: [],
        center: {lat: 49.45466,
            lng: 30.9238},
        isGeoloc: false,
    };

    componentDidMount() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.showPosition);
            } else {
                this.setState({center: {lat: 49.45466,
                        lng: 30.9238}})
            }
    }
     showPosition = (position) => {
         this.setState({center: {lat: position.coords.latitude, lng: position.coords.longitude}, isGeoloc: true})
     }
    renderDeviceTitle = () => {
        if (isMobile) {
            return <div className="large__18 text title_device">Mobile</div>
        }
        return <div className="large__18 text title_device">Desktop</div>
    };

    showWindow = (index, item) => {
        this.setState({isShowWindow: index, item: item})
    };

    hideWindow = () => {
        this.setState({isShowWindow: 0, item: {}})
    };

    componentDidUpdate() {
        Geocode.setApiKey(process.env.REACT_APP_MAP_KEY);
        Geocode.setLanguage("ru");
        Geocode.setRegion("ukr");
    };



  render() {

      const options = {
          imagePath:
              'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      }

    if(this.props.lpu) {
        return (
            <div className="persolan-area__conteiner persolan-area__conteiner__tabs active">
                <div className="large__18 text">Карта ЛПУ</div>
                { this.renderDeviceTitle() }
                <GoogleMap
                    id='medical-map'
                    center={this.state.center}
                    zoom={ this.state.isGeoloc ? 10 : 6}
                >

                    <MarkerClusterer averageCenter maxZoom={12} options={options} gridSize={66}>
                        {clusterer =>
                            this.props.lpu.map((item, index) => {
                                const position = {lat: Number(item.lat), lng: Number(item.lng)};
                                return (
                                    <Marker
                                        key={index}
                                        position={position}
                                        randomNum={this.props.randomNum}
                                        onClick={() => {
                                            this.props.createRandom();
                                            this.showWindow(index + 1, item)
                                        }}
                                        clusterer={clusterer}
                                    />
                                )
                            })
                        }
                    </MarkerClusterer>
                    {!!this.state.isShowWindow &&
                    <InfoWindow
                        position={{lat: Number(this.state.item.lat), lng: Number(this.state.item.lng)}}
                        onCloseClick={this.hideWindow}
                    >
                        <div style={{
                            background: `white`,
                            padding: 10
                        }}>
                            <h3>{this.state.item.title}</h3>
                            <h4>{this.state.item.age_category}</h4>
                            <h4>{this.state.item.name}</h4>
                            <h4>{this.state.item.address}</h4>
                            <p><a href={this.state.item.link} target="_blank"
                                  rel="noopener noreferrer">{this.state.item.link}</a></p>
                        </div>
                    </InfoWindow>
                    }
                </GoogleMap>
            </div>
        )
    } else {
        return (
            <div className="persolan-area__conteiner persolan-area__conteiner__tabs active">
                <div className="large__18 text">Карта ЛПУ</div>
                <GoogleMap
                    id='medical-map'
                    center={this.state.center}
                    zoom={6}
                    on
                />
            </div>
        )

    }
  }
}

const mapStateToProps = (state, ownProps) => ({
    lpu: state.user.userData.lpu,
    ...ownProps
})

export default connect(mapStateToProps)(Map);