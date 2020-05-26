import $ from 'jquery';
import mapplic from 'components/pages/map/libs/mapplic/mapplic';
import locationApi from 'components/pages/map/libs/locationApi';
import languageApi from 'components/pages/map/libs/languageApi';
import offerApi from 'components/pages/map/libs/offerApi';
import QRReader from 'components/pages/map/libs/qrscan';
import isURL from 'is-url';
import constants from 'components/pages/map/libs/constants';
import 'components/pages/map/libs/mapplic/mapplic.css';

import lavinaWhiteSvg from 'assets/img/map/lavina-logo-white.svg';
import arrowWhiteSvg from 'assets/img/map/arrow-left-white.svg';

let graphService = {
  Graph: function () {
    var neighbors = (this.neighbors = {}); // Key = vertex, value = array of neighbors.
    this.addEdge = function (u, v) {
      if (neighbors[u] === undefined) {
        neighbors[u] = [];
      }
      neighbors[u].push(v);
      if (neighbors[v] === undefined) {
        neighbors[v] = []; // to implement an undirected graph.
      } // For a directed graph, delete
      neighbors[v].push(u); // these four lines.
    };
    
    return this;
  },
  
  bfs: function (graph, source) {
    var queue = [{vertex: source, count: 0}],
      visited = {source: true},
      tail = 0;
    while (tail < queue.length) {
      var u = queue[tail].vertex,
        count = queue[tail++].count; // Pop a vertex off the queue.
      graph.neighbors[u].forEach(function (v) {
        if (!visited[v]) {
          visited[v] = true;
          queue.push({vertex: v, count: count + 1});
        }
      });
    }
  },
  
  shortestPath: function (graph, source, target, acum) {
    if (source == target) {
      return; // when the source is equal to
    } // the target.
    var queue = [source],
      visited = {source: true},
      predecessor = {},
      tail = 0;
 
    while (tail < queue.length) {
      var u = queue[tail++], // Pop a vertex off the queue.
        neighbors = graph.neighbors[u];
      for (var i = 0; i < neighbors.length; ++i) {
        var v = neighbors[i];
        if (visited[v]) {
          continue;
        }
        visited[v] = true;
        if (v === target) {
          var path = [v]; // If so, backtrack through the path.
          while (u !== source) {
            path.push(u);
            u = predecessor[u];
          }
          path.push(u);
          path.reverse();
          return path;
        }
        predecessor[v] = u;
        queue.push(v);
      }
    }
  }
};

class MapConstructor {
  constructor(data, toLocation) {
    this.data = data; //
    this.toLocation = toLocation;
    this.directionsTips = data.directionsTips; //
    this.textTransport = data.textTransport;//
    this.listTransport = data.listTransport;//
    // this.terminal = null;
    // this.terminalFloor = null;
    // this.terminalBuild = null;
    this.map = null; //
    this.DefaultScaleStyle = null; //
    this.terminalDelay = 1000;
    this.separationFloor = false; //
    // this.sortArr = null;
    this.tempNumBuild = false; //
    this.listFloorTransports = null;//

    this.Terminal = null; //
    this.TerminalFloor = null; //
    this.TerminalBuild = null; //
    this.transportMove = null; //
    this.stepPopupLoc = true; //
    this.fill = ''; //
    this.TRANSPORT_ESCALATOR = 'escalator'; //
    this.TRANSPORT_LIFT = 'lift'; //
    // this.snackbarMsg = null;
    // this.active2LvlMagazine = 'S21007';
    // this.isAllowedTransition = true;
    
    this.btnRouteContinue = $('#btn-route-continue') || null; //
    this.cartTransport = $('#cart-transport') || null; //
    this.cartTipRoute = $('#cart-tip-route') || null; //
    this.popupMapRoute = $('#popup-map-route') || null; //
    this.screenMap = $('#screen-map') || null; //
    this.screenLocationDetail = $('#screen-location-detail') || null; //
    this.screenLocationsFilteredWithBtnCategory = $('#screen-filtered-locations-btn-category') || null; //
    this.screenCategories = $('#screen-choice-categories') || null; //
    this.screenOffer = $('#screen-offer-detail') || null; //
    this.screenOffers = $('#screen-list-offers') || null; //
    this.searchFilteredLocationsWithTags = $('#search-locations-with-tags') || null; //
    this.scannerMarker = $('#scanner-marker') || null; //

    this.cartHelpRoute = $('#cart-help-route') || null;
    this.screenStartSearch = $('#start-screen-search') || null;

    this.menuListFilteredLocations = $('#menu-list-filtered-locations-and-tags') || null; //
    this.menuListLocations = $('#menu-list-locations') || null; //
    this.blockLocationDetail = $('#block-location-detail') || null; //
    this.menuListCategories = $('#menu-list-categories') || null;
    this.menuListCategoriesMag = $('#menu-list-categories-mag') || null;
    this.blockMap = $('.animate-screen') || null;
    this.allScreensMap = $('.screen') || null;
    this.selectedLanguageMall = $('.selected-language-mall') || null;
    this.menuListLanguagesMall = $('.menu-languages-mall') || null;
    this.selectedLanguageMallMap = $('.selected-language-mall-map') || null;
    this.menuListLanguagesMallMap = $('.menu-languages-mall-map') || null;
    this.menuListOffers = $('#menu-list-offers') || null;
    this.menuListOffersCarousel = $('.menu-list-offers-carousel') || null;
    this.blockOfferDetail = $('#block-offer-detail') || null;
    this.screenScanner = $('#screen-scanner') || null;
    this.snackBarElement = document.querySelector('.app__snackbar') || null;

    ////
    this.FullLocations = []; //
    this.FullTags = [];



    this.locationUseCase = {
      getLocationsAndBuild(mallID, langID) {
        return locationApi.getLocations(mallID, langID)
          .map(locations => {
            this.menuListLocations.html('');
            
            $.each(locations, function (index, item) {
              
              if ($('body #menu-list-locations li').length == 10) {
                
                var li = `<li class="button-up" data-help-b = "true">
                               
                                <a href="#header-top-go"><div class="button-up-img">
									
                                    <img src="./images/svg-icons/arrow-up-blue.svg" alt="">
									
                                </div></a>
                            
                            </li>
							<li id="button-page-findy" class="button-next-locs" data-help-b = "true">
                               
                                <div class="button-next-div" onclick="goNext('menu-list-locations','button-page-findy')">
									
                                    Більше магазинів
									
                                </div>
                            
                            </li>`;
                $(this.menuListLocations).append(li);
              }
              
              if ($('body #menu-list-locations li').length % 2 != 0) {
                if ($('body #menu-list-locations li').length <= 10) {
                  var li = `<li  data-name="${item.name}" data-id-location="${item.id}" data-marker="${item.marker}" data-terminal="${item.id_terminal_shopname}" data-mall_slug="${item.mall_slug}">
                                <div class="item-location open-choose-right-menu">
                                <div class="image-location">
									
                                    <img src="${item.icon_path}" alt="">
									
                                </div>
                              </div>
                            </li>`;
                }
                
                else {
                  var li = `<li class="not-even display-none" data-name="${item.name}" data-id-location="${item.id}" data-marker="${item.marker}" data-terminal="${item.id_terminal_shopname}" data-mall_slug="${item.mall_slug}">
                                <div class="item-location open-choose-right-menu">
                                <div class="image-location">
									
                                    <img src="${item.icon_path}" alt="">
									
                                </div>
                              </div>
                            </li>`;
                }
                
              }
              else {
                if ($('body #menu-list-locations li').length <= 10) {
                  var li = `<li  class="not-even" data-id-location="${item.id}" data-name="${item.name}"  data-marker="${item.marker}" data-terminal="${item.id_terminal_shopname}" data-mall_slug="${item.mall_slug}">
                                <div class="item-location open-choose-right-menu">
                                <div class="image-location">
									
                                    <img src="${item.icon_path}" alt="">
									
                                </div>
                              </div>
                            </li>`;
                }
                
                else {
                  var li = `<li class="display-none" data-name="${item.name}" data-id-location="${item.id}" data-marker="${item.marker}" data-terminal="${item.id_terminal_shopname}" data-mall_slug="${item.mall_slug}">
                                <div class="item-location open-choose-right-menu">
                                <div class="image-location">
									
                                    <img src="${item.icon_path}" alt="">
									
                                </div>
                              </div>
                            </li>`;
                }
              }
              
              
              $(this.menuListLocations).append(li);
            });
            
            return locations;
          });
      },
      buildLocationDetail(location, floor, defaultNumBuild, isParking, separation) {
        this.blockLocationDetail.html('');
        let block =
          
          `
                          <div class="block-location-info">
						  <h1>${location.title}</h1>
                            <div class="block-location-contacts">
                              
                              <div class="location-contacts">
                                <div class="location-time-work">
                                  <div class="contact-item-img">
                                    <img src="./images/svg-icons/clock.svg" alt="">
                                  </div>
								 
                                  <div class="contact-item-text">${location.location_work_time}</div>
                                </div>
                               
                              </div>
							  
                            </div>
                           <ul id="loc-route-web">
								  <li class="loc-route open-start-route popup-path">
								  <div><div class="tmp-img" style="background-image: url(../images/svg-icons/find-route-blue.svg)"></div>
								  <span>Побудувати</br>маршрут</span>
								  </div></li>
								  <li class="loc-web open-website">
								  <div><div class="tmp-img"></div><span>Веб-</br>сторінка</span>
								  </div></li></ul>
                            <div class="location-detail-desc">
                              <p class="loc-text">${location.location_text}
							  
							  </p>
							  <div class="loc-blur-div"></div>
							    <div class="read-more-loc">
								<div class="read-more-loc-block">
   <button class="read-more-loc-plus"><span class="vertical-line"></span>
   <span class="horizontal-line"></span></button> <span class="more-text">Детальніше</span>
   </div>
   </div>
							  
							  
                            </div>
                          </div>`;
        
        $(this.blockLocationDetail).append(block);
        
        
        $('body #page-akcii-shop').html($('body #akcii-mag').html());
        let bg_color = location.location_work_mobile;
        $('body #loc-detail').css('background-color', bg_color);
        $('body #screen-location-detail .bottom-header').css('background-color', bg_color);
        $('body .loc-blur-div').css('background-color', bg_color);
        $('body .read-more-loc').css('background-color', bg_color);
        $('body .read-more-loc-plus span').css('background-color', bg_color);
        
        
        let web_site = $('body #website').attr('data-web');
        $(this.blockLocationDetail).attr("data-web", web_site);
        
        
        $(this.blockLocationDetail).attr("data-loc", location.id);
        $(this.blockLocationDetail).attr("data-lvl", floor);
        $(this.blockLocationDetail).attr("data-title", location.title);
        
        
        if (defaultNumBuild) {
          $(this.blockLocationDetail).attr("data-build", defaultNumBuild);
        } else {
          $(this.blockLocationDetail).attr("data-build", this.general.getDefaultNumBuild());
        }
        $(this.blockLocationDetail).attr("data-isParking", isParking);
        $(this.blockLocationDetail).attr("data-separation", separation);
      },
      buildFilteredLocations(locations, level) {
        $.each(locations, function (index, item) {
          if (item.category != "terminal") {
            
            if ($('body #menu-list-filtered-locations-and-tags li').length % 2 != 0) {
              
              var li = `<li class="locs open-location-with-search" data-location-id="${item.id_num}" data-name="${item.title}" data-build-cat="${item.build_num}" data-level="${parseInt(level)}" data-iter="${index}" data-id="${item.id}">
                              <div class="item-location">
                                <div class="image-location">
                                    <img src="${item.icon}" alt="">
                                </div>
                                
									
									
                                
                                </div>
                             
                            </li>`;
            }
            else {
              var li = `<li class="locs not-even open-location-with-search" data-location-id="${item.id_num}" data-name="${item.title}" data-build-cat="${item.build_num}" data-level="${parseInt(level)}" data-iter="${index}" data-id="${item.id}">
                              <div class="item-location">
                                <div class="image-location">
                                    <img src="${item.icon}" alt="">
                                </div>
                                
									
									
                                
                                </div>
                             
                            </li>`;
            }
            $(this.menuListFilteredLocations).append(li);
          }
        });
        
        return true;
      },
      buildFilteredLocationsIndividual(locations, level, block) {
        $.each(locations, function (index, item) {
          if (item.category != "terminal") {
            
            
            var li = `<li class="locs open-location-with-search" data-location-id="${item.id_num}" data-name="${item.title}" data-build-cat="${item.build_num}" data-level="${parseInt(level)}" data-iter="${index}" data-id="${item.id}">
                              <div class="item-location">
                                <div class="image-location">
                                    <img src="${item.icon}" alt="">
                                </div>
                                
									
									
                                
                                </div>
                             
                            </li>`;
            
            $(block).append(li);
            
          }
        });
        
        return true;
      },
      getLocationByBindTerminal(mallSlug, terminal) {
        return locationApi.getLocationByBindTerminal(mallSlug, terminal)
          .map(location => {
            return location;
          });
      },
      functionallyTags() {
        return locationApi.getObservable()
          .map(response => {
            if (!$(this.screenLocationsFilteredWithBtnCategory).hasClass('show-tags')) {
              // mapSwitch.switchScreen(screenLocationsFilteredWithBtnCategory);
            } else {
              $(this.screenLocationsFilteredWithBtnCategory).removeClass('show-tags');
            }
            
            return response;
          });
      },
      OftenSearch(block, start = true) {
        let tmp_loc = $(block);
        $('body #menu-list-locations-often').html('');
        $('body #menu-list-search').html('');
        $(tmp_loc)
          .each(function (index, loc) {
            
            if ($(loc).attr('data-help-b') != 'true') {
              if (start == true) {
                var id = $(loc).attr('data-id-location');
                var name = $(loc).attr('data-name');
                var marker = $(loc).attr('data-marker');
                var terminal = $(loc).attr('data-terminal');
                var slug = $(loc).attr('data-mall_slug');
                var li = `<li class="search-locs start-search-locs" data-marker="${marker}" data-id-location="${id}" data-mall_slug="${slug}" data-terminal="${terminal}"  >${name}</li>`
              }
              
              
              if (index <= 10) {
                $('#menu-list-locations-often').append($(loc).clone());
              }
              else {
                $(loc).addClass('display-none');
                $('body #menu-list-locations-often').append($(loc).clone());
              }
              $('body #menu-list-search').append(li);
            }
            
            
          });
      },
      OftenSearchPos(locations, level) {
        $.each(locations, function (index, item) {
          if (item.category != "terminal") {
            
            if ($('body #menu-list-locations-often li').length % 2 != 0) {
              
              
              var li = `<li class="locs open-location-with-search" data-location-id="${item.id_num}" data-name="${item.title}" data-build-cat="${item.build_num}" data-level="${parseInt(level)}" data-iter="${index}" data-id="${item.id}">
                              <div class="item-location">
                                <div class="image-location">
                                    <img src="${item.icon}" alt="">
                                </div>
                                
									
									
                                
                                </div>
                             
                            </li>`;
            }
            else {
              var li = `<li class="locs not-even open-location-with-search" data-location-id="${item.id_num}" data-name="${item.title}" data-build-cat="${item.build_num}" data-level="${parseInt(level)}" data-iter="${index}" data-id="${item.id}">
                              <div class="item-location">
                                <div class="image-location">
                                    <img src="${item.icon}" alt="">
                                </div>
                                
									
									
                                
                                </div>
                             
                            </li>`;
            }
            
            
            $('body #menu-list-locations-often').append(li);
          }
        });
        
        return true;
      },
      CategoryBlock(locations, level) {
        $.each(locations, function (index, item) {
          if (item.category != "terminal") {
            
            if ($('body #menu-list-locations-category li').length == 10) {
              var li = `<li class="button-up" data-help-b = "true">
                               
                                <a href="#header-top-category"><div class="button-up-img">
									
                                    <img src="./images/svg-icons/arrow-up-blue.svg" alt="">
									
                                </div></a>
                            
                            </li>
							<li id="button-page-category" class="button-next-locs" data-help-b = "true">
                                <div class="button-next-div" onclick="goNext('menu-list-locations-category','button-page-category')">
                                    Більше магазинів
                                </div>
                            </li>`;
              $('body #menu-list-locations-category').append(li);
            }
            if ($('body #menu-list-locations-category li').length <= 10) {
              if ($('body #menu-list-locations-category li').length % 2 != 0) {
                var li = `<li class="locs open-location-with-search" data-location-id="${item.id_num}" data-name="${item.title}" data-build-cat="${item.build_num}" data-level="${parseInt(level)}" data-iter="${index}" data-id="${item.id}">
                              <div class="item-location">
                                <div class="image-location">
                                    <img src="${item.icon}" alt="">
                                </div>
                                </div>
                            </li>`;
              }
              else {
                var li = `<li class="locs not-even open-location-with-search" data-location-id="${item.id_num}" data-name="${item.title}" data-build-cat="${item.build_num}" data-level="${parseInt(level)}" data-iter="${index}" data-id="${item.id}">
                              <div class="item-location">
                                <div class="image-location">
                                    <img src="${item.icon}" alt="">
                                </div>
                                </div>
                            </li>`;
              }
            }
            else {
              
              if ($('body #menu-list-locations-category li').length % 2 != 0) {
                
                
                var li = `<li class="locs open-location-with-search display-none" data-location-id="${item.id_num}" data-name="${item.title}" data-build-cat="${item.build_num}" data-level="${parseInt(level)}" data-iter="${index}" data-id="${item.id}">
                              <div class="item-location">
                                <div class="image-location">
                                    <img src="${item.icon}" alt="">
                                </div>
                                </div>
                            </li>`;
              }
              else {
                var li = `<li class="locs not-even open-location-with-search display-none" data-location-id="${item.id_num}" data-name="${item.title}" data-build-cat="${item.build_num}" data-level="${parseInt(level)}" data-iter="${index}" data-id="${item.id}">
                              <div class="item-location">
                                <div class="image-location">
                                    <img src="${item.icon}" alt="">
                                </div>
                                </div>
                            </li>`;
              }
            }
            $('body #menu-list-locations-category').append(li);
          }
        });
        return true;
      }
    }
    this.categoryUseCase = {
      getCategoriesAndBuild(categories) {
        $(this.menuListCategories).html('');
        $.each(categories, function (index, item) {
          if (index % 2 != 0) {
            var li = `<li class="open-locations-by-category cat-btn not-even" data-category-id="${item.id_num}" data-iter="${index}" data-id="${item.type_tag}" data-color="${item.color}" data-title="${item.title}">
                        <div class="item-category">
                          
                            <div class="name-category">
                              <span class="name-cat">${item.title}</span>
                              
                            </div>
                            
                          </div>
                        </div>
                      </li>`;
          }
          else {
            var li = `<li class="open-locations-by-category cat-btn" data-category-id="${item.id_num}" data-iter="${index}" data-id="${item.type_tag}" data-color="${item.color}" data-title="${item.title}">
                        <div class="item-category">
                          
                            <div class="name-category">
                              <span class="name-cat">${item.title}</span>
                              
                            </div>
                            
                          </div>
                        </div>
                      </li>`;
          }
          $(this.menuListCategories).append(li);
        });
      },
      getShopsOnly(categories) {
        $(this.menuListCategoriesMag).html('');
        var count = 0;
        $.each(categories, function (index, item) {
          if (item.type_tag == "accessories" || item.type_tag == "cosmetica" || item.type_tag == "moda" || item.type_tag == "phone") {
            
            if (count % 2 != 0) {
              var li = `<li class="open-locations-by-category cat-btn not-even" data-category-id="${item.id_num}" data-iter="${index}" data-id="${item.type_tag}" data-color="${item.color}" data-title="${item.title}">
                        <div class="item-category">
                          
                            <div class="name-category">
                              <span class="name-cat">${item.title}</span>
                              
                            </div>
                            
                          </div>
                        </div>
                      </li>`;
            }
            else {
              var li = `<li class="open-locations-by-category cat-btn" data-category-id="${item.id_num}" data-iter="${index}" data-id="${item.type_tag}" data-color="${item.color}" data-title="${item.title}">
                        <div class="item-category">
                          
                            <div class="name-category">
                              <span class="name-cat">${item.title}</span>
                              
                            </div>
                            
                          </div>
                        </div>
                      </li>`;
            }
            count++;
          }
          
          
          $(this.menuListCategoriesMag).append(li);
        });
      }
    }
    this.general = {
      search(inputID, menuID, classNameText, classNameTextCategory = false) {
        // Declare variables
        var input, filter, ul, li, a, b = false, i;
        input = document.getElementById(inputID);
        filter = input.value.toUpperCase();
        ul = document.getElementById(menuID);
        li = ul.getElementsByTagName('li');
        
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
          a = li[i].getElementsByClassName(classNameText)[0];
          if (classNameTextCategory) {
            b = li[i].getElementsByClassName(classNameTextCategory)[0];
          }
          b = b ? b.innerHTML.toUpperCase().indexOf(filter) > -1 : b;
          if (
            a.innerHTML.toUpperCase().indexOf(filter) > -1 || b) {
            li[i].style.display = "";
          } else {
            li[i].style.display = "none";
          }
        }
      },
      tmp_search(inputID, menuID) {
        // Declare variables
        var input, filter, ul, li, a, b = false, i;
        input = document.getElementById(inputID);
        filter = input.value.toUpperCase();
        
        
        $("#" + menuID + " li").filter(function () {
          
          $(this).toggle($(this).text().toUpperCase().indexOf(filter) > -1)
        });
        
      },
      getDefaultNumBuild() {
        var enableBlock = $('body #enable-file-build');
        
        if ($(enableBlock).attr('data-active-build-temp')) {
          return $(enableBlock).attr('data-active-build-temp');
        } else {
          return $(enableBlock).attr('data-active-build');
        }
      },
      enableSlideElement(element) {
        if ($(element).css('display') == 'none') {
          $(element).slideDown(300);
        } else {
          $(element).slideUp(300);
        }
      },
      slideUpElement(element) {
        $(element).slideUp(300);
      }
    }
    this.mapSwitch = {
      switchScreen(showScreen, backBtn = false) {
        $(this.blockMap).css({'height': '100%'});
        var activeScreen = $('body .screen.active');
        // $('body #floor-block').fadeOut(200);
        //
        $('body #start-screen-search .bottom-header').removeClass('search-active')
        $('body #start-screen-search .header-two').removeClass('search-active-header')
        $('body .search-field').addClass('display-none');
        /* if($('body .toggle-hamburger').hasClass('is-active'))
        {
          $('body .toggle-hamburger').click();
        } */
        //
        var hamburgers = document.querySelectorAll(".toggle-hamburger");
        
        for (var i = hamburgers.length - 1; i >= 0; i--) {
          var hamburger = hamburgers[i];
          if (hamburger.classList.contains("is-active") === true) {
            hamburger.classList.remove("is-active")
            $('body .screen > .header-two').removeClass('fixed-block');
            // $('body #menu').fadeOut('fast');
            $('body .lang-button').css('visibility', 'hidden');
            $('body .click-back-btn').css('visibility', 'visible');
            
          }
        };
        // $('body #popup-map-route').css('display', 'none');

        if ($(showScreen).attr('id') === 'screen-map')
          $('body #screen-map .header-logo img').attr('src', './images/svg-icons/lavina-logo-black.svg');
        /* $('body .animate-screen').addClass('scrollbars') */
        
        // active fixed btns
        if (
          $(showScreen).attr('id') === 'screen-offer-detail' ||
          $(showScreen).attr('id') === 'screen-location-detail' ||
          // $(showScreen).attr('id') === 'screen-filtered-locations-btn-category' ||
          $(showScreen).attr('id') === 'screen-map'
        ) {
          $('body .btn-block').css({'display': 'block'});
        } else {
          $('body .btn-block').css({'display': 'none'});
        }
        
        if ($(showScreen).attr('id') === 'screen-filtered-locations-btn-category') {
          $('body .btn-block.btn-category').css({'display': 'block'});
        } else {
          $('body .btn-block.btn-category').css({'display': 'none'});
        }
        
        if ($(showScreen).attr('id') === $(this.screenMap).attr('id')) {
          if ($(".open-map-menu").hasClass('active')) {
            $(".open-map-menu").trigger('click');
          }
          // TODO 2
          // $('#popup-map-route').fadeOut(10);
          // $('#cart-transport').fadeOut(10);
          // $(this.popupMapRoute).fadeOut(10);
          // $(this.cartTransport).fadeOut(10);
          // $('#cart-tip-route').fadeOut(10)
          // $(this.cartTipRoute).fadeOut(10);
          // $(this.btnRouteContinue).fadeOut(10);
          // $('#btn-route-continue').fadeOut(10)
        }
        
        if (backBtn) {
          $(activeScreen).css({'right': '-100%'});
          $(showScreen).css({'right': '0'});
          $(activeScreen).removeClass('active');
          $(showScreen).addClass('active');
        } else {
          $(activeScreen).css({'right': '100%'});
          $(showScreen).css({'right': '0'});
          $(activeScreen).removeClass('active');
          $(showScreen).addClass('active');
        }
      },
      hideScreensMap() {
        $('body .btn-block.btn-category').css({'display': 'none'});
        $(this.allScreensMap).removeClass('active');
        $(this.allScreensMap).removeAttr('style');
        $(this.blockMap).removeAttr('style');
      },
      switchToMap(showScreen) {
        $(showScreen).addClass('active');
        $(showScreen).css({'right': '0'});
        $(this.blockMap).css({'height': '100%'});
      }
    }
    this.tagsUseCase = {
      getFilteredTagsAndBuild(tagsP) {
        let tags = tagsP;
        $.each(tags, function (index, item) {
          var li = `<li class="open-locations-by-tag" data-name="${item.tag}" data-tag-name="${item.tag}">
                          <div class="item-tag" data-tag-id="${item.id}">
                            <div class="image-tag">#</div>
                            <div class="left-block-item-tag">
                              <div class="name-tag">
                                <span class="name-loc" style="color: blue">${item.tag}</span>
                              </div>
                            </div>
                          </div>
                        </li>`;
          
          $(this.menuListFilteredLocations).append(li);
        });
      }
    }
    this.landguageUseCase = {
      getLanguagesAndBuild(mallID) {
        return languageApi.getLanguages(mallID)
          .map(languages => {
            let langID;
            $(this.menuListLanguagesMall).html('');
            $(this.selectedLanguageMall).html('');
            
            $.each(languages, function (index, item) {
              if (item.default) {
                langID = item.id;
                $(this.selectedLanguageMall).html(item.iso);
              } else {
                var li = `<li class="select-language" data-language-id="${item.id}"><a href="#">${item.iso}</a></li>`;
                $(this.menuListLanguagesMall).append(li);
              }
            });
            
            return langID;
          });
      },
      buildLanguagesMap(languages, currentlangID) {
        let langID;
        $(this.menuListLanguagesMallMap).html('');
        $(this.selectedLanguageMallMap).html('');
        
        $.each(languages, function (index, item) {
          if (parseInt(item.id) == parseInt(currentlangID)) {
            $(this.selectedLanguageMallMap).html(item.iso);
            langID = item.id;
          } else {
            var li = `<li class="select-language-map" data-language-id="${item.id}"><a href="#">${item.iso}</a></li>`;
            $(this.menuListLanguagesMallMap).append(li);
          }
        });
        
        return langID;
      },
      changeLanguagesAndBuild(mallID, langID) {
        return languageApi.getLanguages(mallID)
          .map(languages => {
            $(this.menuListLanguagesMall).html('');
            $(this.selectedLanguageMall).html('');
            
            $.each(languages, function (index, item) {
              if (parseInt(langID) == parseInt(item.id)) {
                $(this.selectedLanguageMall).html(item.iso);
              } else {
                var li = `<li class="select-language" data-language-id="${item.id}"><a href="#">${item.iso}</a></li>`;
                $(this.menuListLanguagesMall).append(li);
              }
            });
            
            return Number(langID);
          });
      },
    }
    this.offerUseCase = {
      buildOffers(offers) {
        $(this.menuListOffers).html('');
        $.each(offers, function (index, item) {
          var li = `<li data-offer-id="${item.id}">
                        <div class="block-offer-image-offers">
                          <img src="${item.icon_path}" alt="">
                        </div>
                        <div class="item-offer">
                          <div class="left-block-item-offer">
                            <div class="image-offer">
                                <img src="${item.icon_path}" alt="">
                            </div>
                            <div class="name-offer">
                              <span class="name-offer">${item.name}</span>
                              <small class="name-cat-offer">${item.category}</small>
                            </div>
                          </div>
                        </div>
                      </li>`;
          
          $(this.menuListOffers).append(li);
        });
      },
      buildOffersCarousel(offers) {
        $(this.menuListOffersCarousel).html('');
        $.each(offers, function (index, item) {
          var li = `<div class="item-offer-carousel open-offer-carousel" data-offer-id="${item.id}">
                            <img src="${item.icon_path}" alt="">
                        </div>`;
          
          $(this.menuListOffersCarousel).append(li);
        });
        
        $(this.menuListOffersCarousel).trigger('destroy.owl.carousel');
        // $(this.menuListOffersCarousel).owlCarousel({
        //   items:1,
        //   loop:true,
        //   margin:10,
        //   autoplay:true,
        //   dots:false,
        //   autoplayTimeout:5000,
        //   autoplayHoverPause:true
        // });
      },
      buildOfferDetail(offer, location, floor, defaultNumBuild, isParking, separation) {
        $(this.blockOfferDetail).html('');
        let block =
          `<div class="block-offer-banner">
                <img src="${offer.icon_path}" alt="">
              </div>
              <div class="block-offer-info">
                <h3 class="offer-detail-name">${offer.name}</h3>
                <small class="deadline-offer-detail">${offer.dead_line}</small>
                <div class="offer-detail-desc">
                  <p>${offer.desc}</p>
                </div>
              </div>`;
        
        $(this.blockOfferDetail).append(block);
        
        $(this.blockOfferDetail).attr("data-loc", location.id);
        $(this.blockOfferDetail).attr("data-lvl", floor);
        if (defaultNumBuild) {
          $(this.blockOfferDetail).attr("data-build", defaultNumBuild);
        } else {
          $(this.blockOfferDetail).attr("data-build", this.general.getDefaultNumBuild());
        }
        $(this.blockOfferDetail).attr("data-isParking", isParking);
        $(this.blockOfferDetail).attr("data-separation", separation);
      }
    }
    this.snackbar = {
      show(msg, options = 4000) {
        if (!msg) return;
        
        if (this.snackbarMsg) {
          this.snackbarMsg.remove();
        }
        
        this.snackbarMsg = document.createElement('div');
        this.snackbarMsg.className = 'app__snackbar-msg';
        this.snackbarMsg.textContent = msg;
        this.snackBarElement.appendChild(this.snackbarMsg);
        
        //Show toast for 3secs and hide it
        setTimeout(() => {
          this.snackbarMsg.remove();
        }, options);
      },
      showInstallAppIos(msg) {
        if (!msg) return;
        
        if (this.snackbarMsg) {
          this.snackbarMsg.remove();
        }
        
        // console.log('qwe');
        this.snackbarMsg = document.createElement('div');
        this.snackbarMsg.className = 'app__snackbar-msg-install-ios';
        this.snackbarMsg.textContent = msg;
        this.snackBarElement.appendChild(this.snackbarMsg);
        
        if (false) {
          this.snackbarMsg.remove();
        }
      }
    }
  }
  
  static ctx = this;
  
  loadJSON() {

    for(var b = 0; b < this.data.levels.length; b++) {
      for (var i = 0; i < this.data.levels[b].length; i++) {
        var tempLevel = this.data.levels[b][i];
        for (var x = 0; x < tempLevel.locations.length; x++) { // Цикл получения объекта терминала и этажа терминала + получения их в переменные
          if (this.data.terminalId.includes(tempLevel.locations[x].id)) { // Раз Раз
            this.Terminal = tempLevel.locations[x];
            // this.TerminalFloor = i + 1 + "-floor";
            this.TerminalFloor = this.Terminal.level_num;
            this.TerminalBuild = b+1;
          }
        }
      }
    }

    this.initialMap(this.data.jsonPath);
  }
  
  initialMap(json) {
    this.map = $('body #svg-map').mapplic({
      source: json,
      height: 905,
      minimap: false,
      sidebar: false,
      clearbutton: false,
      zoombuttons: false,
      hovertip: {desc: false},
      tooltip: {thumb: true, desc: true, link: true},
      markers: true,
      /* developer: true, */
      minscale: 1,
      maxscale: 2.5,
      fullscreen: false,
      fillcolor: '#757575'
    });

    this.map.on('mapready', (e, self) => {
  
      var getStylesTimeout = setTimeout(() => {
        this.DefaultScaleStyle = $('body .mapplic-map').attr('style');
        for (var y = 0; y < $("path[data-obr='terminal-display']").length; y++) {
          if (
            $("path[data-obr='terminal-display']")
              .eq(y)
              .attr('data-term') != this.data.terminalId
          ) {
            $("path[data-obr='terminal-display']")
              .eq(y)
              .css('display', 'none');
          }
        }
        $('body .nav-placeholder, .bottom-nav-placeholder').css('height', $('body .top-nav').height() + 'px');
        this.initLevelCovers(this);
        
        clearTimeout(getStylesTimeout);
      }, this.terminalDelay);

      $('body .where-am-i').trigger('click');
      
      // setTimeout(function(){
        // $('body #fullsize-preloader-map').removeClass('active');
        $('body .popup-path').trigger('click');
      // }, 2000)

      console.log('map-ready', $('body .popup-path'))
    });

   
  }
  
  initLevelCovers(CTX) {
    $('body .level-cover').on('click', function (e) {
      e.stopPropagation();
      console.log('LEVEL COVER');
      $(".level-select[data-value='" + $(this).attr('data-floor') + "'][data-build='" +
        CTX.getDefaultNumBuild() + "']").trigger('click');
    });
  }
  
  getDefaultNumBuild() {
    let enableBlock = $('body #enable-file-build');
    
    if ($(enableBlock).attr('data-active-build-temp')) {
      return $(enableBlock).attr('data-active-build-temp');
    } else {
      return $(enableBlock).attr('data-active-build');
    }
  }
  
  // PATHS
  buildLvlLinesTree(lvlId, shopId, direction = false, drawOnMap = true, CTX = this) {
    if (direction == false) {
      direction = CTX.data.terminalId;
    }
    console.log('222 buildLvlLinesTree => createPathFromLines:', 'direction', direction, 'shopId', shopId);

    var levelFloorIndex = lvlId;
    
    let lines = [];
  
    // console.log('ПЕРЕБОР ДЛЯ ПОУЧЕНИЯ ЛИНИЙ =>', lvlId, $('body div[data-floor="' + lvlId + '"] line.rootline'));
    
    $('body div[data-floor="' + lvlId + '"] line.rootline').map((key, value) => {
      var id = value.id.split('_')[1];
      if (!id || id === '' || id === '0') {
        id = parseInt(Math.random() * 1000000 + 1000000) + 'line';
      }
      
      lines = [
        ...lines,
        {
          id: value.id,
          x1: value.x1.baseVal.valueAsString,
          y1: value.y1.baseVal.valueAsString,
          x2: value.x2.baseVal.valueAsString,
          y2: value.y2.baseVal.valueAsString,
          shopId: id
        }
      ];
    });
    
    console.log('_find_3 вызов PathFinder (direction, CTX.data)', direction, CTX.data);
    
    let pf = new PathFinder(lines);
    var pathLines = pf.findPath(direction, shopId);
    // console.log('END pathLines = ', pathLines);
    CTX.createPathFromLines(pathLines, levelFloorIndex, drawOnMap);
  }
  
  appendPath(params, id, levelFloorIndex, drawOnMap = true, CTX = this) {
  
    // console.log('444 appendPath => end:', 'params', params, 'id', id, 'drawOnMap', drawOnMap);
    
    var indexFloor = levelFloorIndex.split('-')[0];
    
    if (!CTX.separationFloor) {
      $('body #rootsPath-' + indexFloor + '-' + CTX.getDefaultNumBuild()).empty();
      CTX.separationFloor = false;
    }
    
    let containerOfPath = document.getElementById('rootsPath-' + indexFloor + '-' + CTX.getDefaultNumBuild());
    
    // console.log('!!!CREATE_ROOT_PATH!!!', containerOfPath);
    
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    path.setAttribute('d', params.d);
    path.setAttribute('id', id);
    containerOfPath.appendChild(path);
    
    if (!drawOnMap) {
      containerOfPath.removeChild(path);
    }
    
    // console.log('path');
    // console.log(path);
  }
  
  createPathFromLines(route, levelFloorIndex, drawOnMap = true, CTX = this) {

    let previous = null;
    let d = 'M ' + route[0].x1 + ' ' + route[0].y1;
    route.map((value, key) => {
      if (previous !== null) {
        d = d + ' ' + value.x1 + ' ' + value.y1;
      }
      previous = value;
    });
    
    CTX.appendPath(
      {
        d: d
      },
      CTX.data.pathToShopId,
      levelFloorIndex,
      drawOnMap
    );
  }


  
  actionsClick(CTX = this) {
    $(CTX.snackBarElement).on('click', function () {
      // $(this).fadeOut(300);
    });

    $(document).on('click', '.where-am-i', function () {
      // $('#my_div').css('display', 'none');

      // Заюзаєм левел точки А
      var TerminalFloorLvl = CTX.TerminalFloor;
      // var TerminalFloorLvl = CTX.data.terminalLvl + '-floor';

      // $('body .build[data-build-btn=' + CTX.TerminalBuild + ']').trigger('click')
      // $('body .floor-num').html(CTX.data.terminalLvl);

      // var ss = $(".level-select[data-value='" + TerminalFloorLvl + "']");
      // $(".level-select[data-value='" + TerminalFloorLvl + "']").addClass('active-floor');

      if (!$('body .map-cover').hasClass('hidden')) {
        console.log('1');
        if (!$('body .map-cover').hasClass('hidden') && CTX.TerminalBuild != CTX.getDefaultNumBuild()) {
          $('body .build[data-build-btn=' + CTX.TerminalBuild + ']').trigger('click');
          $('body .level-select[data-build=' + CTX.TerminalBuild + "][data-value='" + TerminalFloorLvl + "']").trigger('click');
        }
        
        $('body .idle-layer[data-build=' + CTX.TerminalBuild + ']').each(function () {
          if ($(this).attr('data-floor') != TerminalFloorLvl) {
            $(this).animate(
              {
                'opacity': 0,
                'margin-top': '0px'
              },
              {
                complete: function () {
                  $(this).attr('style', '');
                  $(this).hide();
                }
              },
              500
            );
          } else {
            $(this).animate(
              {
                'margin-top': '0px'
              },
              {
                complete: function () {
                  $(this).attr('style', '');
                  $('body #' + CTX.data.terminalId).trigger('click');
                }
              },
              500
            );
          }
        });
        
        $('body .idle-layer')
          .removeClass('idle idle-fix')
          .addClass('notidle');

        // $('body .build-hidden').addClass('display-none')

        $('body .map-cover').addClass('hidden');
      } else if (
        $('body .map-cover').hasClass('hidden') &&
        TerminalFloorLvl != $('body .idle-layer[data-build=' + CTX.TerminalBuild + '].active').attr('data-floor')
      ) {
        if (CTX.TerminalBuild != CTX.getDefaultNumBuild()) {
          $('body .build[data-build-btn=' + CTX.TerminalBuild + ']').trigger('click');
          $('body .level-select[data-build=' + CTX.TerminalBuild + "][data-value='" + TerminalFloorLvl + "']").trigger('click');
        }
        
        $('body .idle-layer.active').fadeOut(500, function () {
          $(this).hide();
        });
        $('body .idle-layer[data-build=' + CTX.TerminalBuild + "][data-floor='" + CTX.data.terminalLvl + "-floor']").fadeIn(500, function () {
          $(this).show();
        });
        // CTX.isAllowedTransition = false;
        $('body #' + CTX.data.terminalId).trigger('click');
      } else {
        console.log('3');
        // CTX.isAllowedTransition = false;
        $('body #' + CTX.data.terminalId).trigger('click');
      }
      var floor_name = $('body .level-select[data-build=' + CTX.TerminalBuild + "][data-value='" + CTX.data.terminalLvl + "-floor']").attr(
        'data-level-title'
      );
      
    });
    $(document).on('click', '#btn-cancel-tip-route', function() {
      // $('body .btn-circle-menu').fadeIn(300);
      $('body .custom-clear').trigger('click');
    });
    $(document).on('click', '.mapplic-clickable', function () {
      CTX.tempNumBuild = true;
      var mapplic = $(this).closest('.mapplic-layer');
      var locIdStr = $(this).attr('id');
      if (locIdStr.indexOf('terminal') + 1) {
        return;
      }
      console.log('_find_6 locLi-(locIdStr)', locIdStr);
      var locLi = $('body #menu-list-filtered-locations-and-tags li[data-id="' + locIdStr + '"]');

      var floor = parseInt($(locLi).attr('data-level')) + 1 + '-floor';
      var isParking = $('body #' + locIdStr)
        .closest('.mapplic-layer')
        .attr('data-isParking');
      var separation = $('body #' + locIdStr)
        .closest('.mapplic-layer')
        .attr('data-separation');
      var location;
      var build = $(locLi).attr('data-build-cat');

      // console.log(CTX.listFloorTransports, floor, build);
      CTX.listFloorTransports = $('body .mapplic-layer[data-floor="' + floor + '"][data-build="' + build + '"]').find('.lift');

      var mallIdFromLS = window.localStorage.getItem('mall_id') || 28;

      if (CTX.isAllowedTransition) {
        // window.location.href = `/${mallIdFromLS}/${$(this).attr('data-shop-id')}/shop`;
      }
      CTX.isAllowedTransition = true;

      var sss = parseInt($(locLi).attr('data-level'));
      var levelObj = CTX.data.levels[build - 1][parseInt($(locLi).attr('data-level'))].locations;
      for (var i = 0; i < levelObj.length; i++) {
        if (levelObj[i].id == $(locLi).attr('data-id')) {
          location = levelObj[i];
          break;
        }
      }

      if (!location.id.includes('terminal')) {
        CTX.transportMove = null;
        CTX.locPopupInit(location, floor, isParking, build, separation);
        /* } */
      }
    });
    
    var prevscreen, backbtn, block, locLevel, locBuild, locId, direction, name_of_loc, locExit, locLevelExitINT,
      terminalExit, terminalLevelExitINT, TerminalFloorInt, locLevelInt, chainRoutes, chainRoutesBuild = false,
      terminalIdReplace;

    console.log($(".popup-path"), "CLIKKCCKCKCK")

    $(document).on('click', '.popup-path', function () {

      $('body #' + CTX.data.terminalId).trigger('click');
      // CTX.active2LvlMagazine = CTX.toLocation.id;
      // console.log('CTX.active2LvlMagazine', CTX.active2LvlMagazine);

      // Функция проложения маршрута при нажатии на кнопку "Проложить маршрут" в попапе
      prevscreen = $('body .screen.active').attr('id');
      backbtn = $('body #open-list-magazines').find('.click-back-btn');
      $(backbtn).attr('data-screen-to-switch', prevscreen);

      console.log('CLICK POPUP-PATH', prevscreen, backbtn, $(backbtn).attr('data-screen-to-switch', prevscreen));

      $('body #popup-map-route').removeClass('continue-route');

      for (var b = 0; b < CTX.data.levels.length; b++) {
        for (var i = 0; i < CTX.data.levels[b].length; i++) {
          $('body #rootsPath-' + (i + 1) + '-' + (b + 1)).html('');
        }
      }
      CTX.listFloorTransports = $('body .mapplic-layer[data-floor="' + CTX.toLocation.level_num + '"][data-build="' + CTX.toLocation.build_num + '"]').find('.lift');

      console.log(CTX.toLocation, "Location")

      locLevel = CTX.toLocation.level_num;
      locBuild = CTX.toLocation.build_num;
      locId = CTX.toLocation.id;
      // direction;
      name_of_loc = CTX.toLocation.title;
      $('body .mapplic-highlighted').removeClass('mapplic-highlighted');
      $('body #' + locId).addClass('mapplic-highlighted');

      terminalIdReplace = CTX.Terminal.id;

      locExit = $('body .mapplic-layer.idle-layer[data-build=' + locBuild + ']').find('.exit');
      locLevelExitINT = parseInt($(locExit).closest('body .mapplic-layer.idle-layer').attr('data-floor'));
      
      terminalExit = $('body .mapplic-layer.idle-layer[data-build=' + CTX.TerminalBuild + ']').find('.exit');
      
      console.log(terminalExit, "terminalExit")
      
      terminalLevelExitINT = $(terminalExit).closest('body .mapplic-layer.idle-layer').attr('data-floor');
      
      console.log(terminalLevelExitINT, "terminalLevelExitINT", CTX.TerminalBuild)
      
      TerminalFloorInt = parseInt(CTX.TerminalFloor);
      locLevelInt = parseInt(locLevel);

      console.log('CPP 1');

      if ( (parseInt(CTX.TerminalBuild) + parseInt(CTX.TerminalFloor)) !== (parseInt(locBuild) + parseInt(locLevel)) ){
        console.log('CPP 2');
        if (CTX.openSelectTransport(CTX.listFloorTransports, name_of_loc)) {
          console.log('CPP 3');
        }
      }
      else {
        console.log('CPP 10');
        CTX.transportMove = null;
        chainRoutes = CTX.startBuildRoute(terminalIdReplace, TerminalFloorInt, locLevelInt, locId, CTX.transportMove, CTX.TerminalBuild, CTX.TerminalBuild);
        $(document).off('click touchstart', '.btn-route-continue-go');
        CTX.buildAnimationRoute(chainRoutes, chainRoutesBuild);
        CTX.tempNumBuild = false;
      }
    });
// TC
    $(document).on('click touchstart', '.select-transport-click', function () {
      console.log('CPP 4');
      CTX.transportMove = $(this).attr('data-transport');
      // CTX.transportMove = null;

      CTX.stepPopupLoc = false;

      $('body #screen-map .header-logo img').attr('src', './images/svg-icons/lavina-logo-black.svg');
      $('body #screen-map .header-top-left-second').css('border', '1px solid rgba(27, 18, 81, 0.3)');
      $('body #screen-map .header-top-left-second > span > img').attr('src', 'images/svg-icons/icon-back.svg');
      $('body #screen-map .header-two').css('background', '#F3F4FA');

      // TODO 4
      $(CTX.popupMapRoute).fadeOut(300);
      $(CTX.cartTransport).fadeOut(300);
      // $('#popup-map-route').fadeOut(300);
      // $('#cart-transport').fadeOut(300);
      // $('body .btn-circle-menu').fadeOut(300);

      if (parseInt(locBuild) !== parseInt(CTX.TerminalBuild)) {
        console.log('CPP 5');
        $('body .build[data-build-btn=' + CTX.TerminalBuild + ']').attr('loc-change', true);
        $('body .build[data-build-btn=' + CTX.TerminalBuild + ']').trigger('click');

        // go to exit in terminal build

        chainRoutes = CTX.startBuildRoute(
          terminalIdReplace,
          TerminalFloorInt,
          terminalLevelExitINT,
          'exit4',
          // terminalExitIdReplace,
          CTX.transportMove,
          CTX.TerminalBuild,
          CTX.TerminalBuild
        );

        if (chainRoutes.length === 0) {
          console.log('not path');
        } else {
          console.log(chainRoutes);
        }

        $('body .build[data-build-btn=' + locBuild + ']').attr('loc-change', true);
        $('body .build[data-build-btn=' + locBuild + ']').trigger('click');
        // go to loc in loc build
        chainRoutesBuild = CTX.startBuildRoute(
            "exit4",
            locLevelExitINT,
            locLevelInt,
            locId,
            CTX.transportMove,
            locBuild,
            CTX.TerminalBuild);
        console.log('CPP 8');
        if (chainRoutesBuild.length === 0) {
          console.log('not path');
        } else {
          console.log(chainRoutesBuild);
        }

        $(document).off('click touchstart', '.btn-route-continue-go');
        CTX.buildAnimationRoute(chainRoutes, chainRoutesBuild);
        CTX.tempNumBuild = false;
      } else {

        $('body .build[data-build-btn=' + CTX.TerminalBuild + ']').attr('loc-change', true);
        $('body .build[data-build-btn=' + CTX.TerminalBuild + ']').trigger('click');

        chainRoutes = CTX.startBuildRoute(
          terminalIdReplace,
          TerminalFloorInt,
          locLevelInt,
          locId,
          CTX.transportMove,
          CTX.TerminalBuild,
          CTX.TerminalBuild
        );


        if (chainRoutes.length === 0) {
          console.log('not path');
        } else {
          console.log(chainRoutes);
        }
        $(document).off('click touchstart', '.btn-route-continue-go');
        CTX.buildAnimationRoute(chainRoutes, chainRoutesBuild);
        CTX.tempNumBuild = false;
      }
    });
    
    
    $('body .key-lang').on('click', function () {
      $('body .key-lang.active-lang').removeClass('active-lang');
      $(this).addClass('active-lang');
      if (!$('body .keyboard.shown').hasClass($(this).attr('data-lang'))) {
        $('body .keyboard.shown').slideUp(200, function () {
          $(this).removeClass('shown');
        });
        
        $('body .keyboard.' + $(this).attr('data-lang')).slideDown(200, function () {
          $(this).addClass('shown');
        });
      }
    });
    $('body .keyboard-wrap .key').on('click', function () {
      // Функционал клавиатуры в поиске
      var inpVal = $('body .search-input input').val();
      if ($(this).hasClass('delete')) {
        console.log('delete');
        $('body .search-input input').val(inpVal.substring(0, inpVal.length - 1));
      } else if ($(this).hasClass('space')) {
        $('body .search-input input').val(inpVal + ' ');
      } else {
        $('body .search-input input').val(inpVal + $(this).text());
      }
      $('body .search-input input').trigger('change');
    });
    $('body .top-lang-item').on('click', function () {
      // Ивент смены языка по клику
      if (!$(this).hasClass('active-lang')) {
        var lang = $(this).attr('data-lang');
        CTX.clearModule(); // Полная очистка модуля с картой
        CTX.loadJson('data_' + $(this).attr('data-lang') + '.json', 'bottom-line_' + $(this).attr('data-lang') + '.json'); // Загрузка JSONов определенного языка
        CTX.initMap('data_' + $(this).attr('data-lang') + '.json'); // Загрузка карты из определенного JSON
        CTX.initMapCover(); // Инициализация элемента накрытия карты
        $('body .map-cover.hidden').removeClass('hidden'); // Инициализация накрытия карты
        // Отображение активного языка
        $('body .top-lang-item.active-lang').removeClass('active-lang');
        $('body .lang-btn').each(function () {
          $(this).attr('src', CTX.framePath + $(this).attr('data-' + lang));
        });
        $('body .lang-text').each(function () {
          $(this).text($(this).attr('data-' + lang));
        });
        $('body .lang-place').each(function () {
          $(this).attr('placeholder', $(this).attr('data-' + lang));
        });
        $(this).addClass('active-lang');
      }
    });
    $('body .all-btn').on('click', function () {
      CTX.carouselAllShops();
    });

    $(document).on('click', '.open-list-magazines', function () {
      $('body #menu-list-locations-mag').html('');
      var prevscreen = $('body .screen.active').attr('id');
      CTX.categoryUseCase.getShopsOnly(CTX.data.categories);
      
      for (let b = 0; b < CTX.data.levels.length; b++) {
        for (let i = 0; i < CTX.data.levels[b].length; i++) {
          let tempLevel = CTX.data.levels[b][i];
          var locationsTags = [];
          
          for (let x = 0; x < tempLevel.locations.length; x++) {
            if (
              tempLevel.locations[x].category == 'accessories' ||
              tempLevel.locations[x].category == 'cosmetica' ||
              tempLevel.locations[x].category == 'moda' ||
              tempLevel.locations[x].category == 'phone' ||
              tempLevel.locations[x].category == 'boots'
            ) {
              locationsTags.push(tempLevel.locations[x]);
            }
          }
  
          CTX.locationUseCase.buildFilteredLocationsIndividual(locationsTags, i, '#menu-list-locations-mag');
        }
      }
      
      var backbtn = $('body #open-list-magazines').find('.click-back-btn');
      $(backbtn).attr('data-screen-to-switch', prevscreen);
      
      // mapSwitch.switchScreen('#open-list-magazines');
    });
    $(document).on('click', '.open-categories', function () {
      $('body #menu-list-locations-category').html('');
      CTX.categoryUseCase.getCategoriesAndBuild(CTX.data.categories);
      for (let b = 0; b < CTX.data.levels.length; b++) {
        for (let i = 0; i < CTX.data.levels[b].length; i++) {
          let tempLevel = CTX.data.levels[b][i];
          var locationsTags = [];
          
          for (let x = 0; x < tempLevel.locations.length; x++) {
            locationsTags.push(tempLevel.locations[x]);
          }
          
          CTX.locationUseCase.CategoryBlock(locationsTags, i);
        }
      }
      CTX.mapSwitch.switchScreen(CTX.screenCategories);
    });
    $(document).on('click', '.open-map-with-marker', function () {
      $('body #' + CTX.data.terminalId).trigger('click');
      
      var prevscreen = $('body .screen.active').attr('id');
      var backbtn = $('body #open-list-magazines').find('.click-back-btn');
      $(backbtn).attr('data-screen-to-switch', prevscreen);
      $('body #screen-map .header-top-left-second > span > img').attr('src', 'images/svg-icons/icon-back.svg');
      CTX.mapSwitch.switchScreen(CTX.screenMap);
      $('body .where-am-i').trigger('click');
    });
    $(document).on('click', '.plus-search', function () {
      $('body #menu-list-locations-often').html('');
      $('body #menu-list-search').html('');
      
      let prevscreen = $('body .screen.active').attr('id');
      if (prevscreen != 'screen-choice-locations') {
        for (let b = 0; b < CTX.data.levels.length; b++) {
          for (let i = 0; i < CTX.data.levels[b].length; i++) {
            let tempLevel = CTX.data.levels[b][i];
            var locationsTags = [];
            
            for (let x = 0; x < tempLevel.locations.length; x++) {
              locationsTags.push(tempLevel.locations[x]);
              var idloc = tempLevel.locations[x].id_num;
              var name = tempLevel.locations[x].title;
              var build = tempLevel.locations[x].build_num;
              var level = parseInt(i);
              var iter = x;
              var id = tempLevel.locations[x].id;
              var li = `<li class="search-locs open-location-with-search"  data-location-id="${idloc}" data-name="${name}" data-build-cat="${build}" data-level="${level}" data-iter="${iter}" data-id="${id}" >${name}</li>`;
              if (!id.includes('terminal')) $('body #menu-list-search').append(li);
            }
            
            CTX.locationUseCase.OftenSearchPos(locationsTags, i);
          }
        }
      } else {
        CTX.locationUseCase.OftenSearch('#menu-list-locations li');
      }
      
      CTX.mapSwitch.switchScreen(CTX.screenStartSearch);
      
      $($(CTX.screenStartSearch).find('.click-back-btn')).attr('data-screen-to-switch', prevscreen);
    });
    $(document).on('click', '.open-offer', function () {
      let offerID = $(this).attr('data-offer-id');
      let offer;
      for (let i = 0; i < CTX.data.offers.length; i++) {
        if (parseInt(offerID) === parseInt(CTX.data.offers[i].id)) {
          offer = CTX.data.offers[i];
        }
      }

      var floor = parseInt($(this).closest('li').attr('data-level')) + 1 + '-floor';
      var isParking = $(this).closest('li').closest('.mapplic-layer').attr('data-isParking');
      var separation = $(this).closest('li').closest('.mapplic-layer').attr('data-separation');
      CTX.listFloorTransports = $('.mapplic-layer[data-floor="' + $(this).closest('li').attr('data-level') + '-floor"][data-build="' + $(this).closest('li').attr('data-build-cat') + '"]').find('.lift');
      var location;
      var build = $(this).closest('li').attr('data-build-cat');
      var levelObj = CTX.data.levels[build - 1][parseInt($(this).closest('li').attr('data-level'))].locations;
      for (var i = 0; i < levelObj.length; i++) {
        if (levelObj[i].id == $(this).closest('li').attr('data-id')) {
          location = levelObj[i];
          break;
        }
      }
      
      if (!location.id.includes('terminal')) {
        // Проверка нахождение терминала и локации, если false то выбор транспорта не нужен
        CTX.transportMove = null;
        CTX.locPopupInit(location, floor, isParking, build, separation, offer);
      }
    });
    $(document).on('click', '.open-offer-carousel', function () {
      let offerID = $(this).attr('data-offer-id');
      
      $('body .open-offer[data-offer-id="' + offerID + '"]').trigger('click');
    });
    $(document).on('click', '.open-list-offers', function () {
      CTX.mapSwitch.switchScreen(CTX.screenOffers);
    });
    $(document).on('click touchstart', '#back-btn-mall', function () {
      CTX.tempNumBuild = true;
      let locID = $(CTX.scannerMarker).attr('locID');
      var locLi = $('body #menu-list-filtered-locations-and-tags li[data-location-id="' + locID + '"]');
      var locIdStr = $(locLi).attr('data-id');

      var floor = parseInt($(locLi).attr('data-level')) + 1 + '-floor';
      var isParking = $('body #' + locIdStr)
        .closest('.mapplic-layer')
        .attr('data-isParking');
      var separation = $('body #' + locIdStr)
        .closest('.mapplic-layer')
        .attr('data-separation');
      var location;
      var build = $(locLi).attr('data-build-cat');
      CTX.listFloorTransports = $('body .mapplic-layer[data-floor="' + floor + '"][data-build="' + build + '"]').find('.lift');
      var levelObj = CTX.data.levels[build - 1][parseInt($(locLi).attr('data-level'))].locations;
      for (var i = 0; i < levelObj.length; i++) {
        if (levelObj[i].id == $(locLi).attr('data-id')) {
          location = levelObj[i];
          break;
        }
      }


      if (!location.id.includes('terminal')) {
        CTX.transportMove = null;
        CTX.locPopupInit(location, floor, isParking, build, separation);
      }
    });
    $(document).on('click', '.open-location-with-search', function () {
      // Инициализация попапа локации при клике из поиска
      $('body .search-field').addClass('display-none');
      $('body #start-screen-search .bottom-header').removeClass('search-active');
      $('body #start-screen-search .header-two').removeClass('search-active-header');
      CTX.tempNumBuild = true;
      
      var locIDStr = $(this).attr('data-id');
      var floor = parseInt($(this).attr('data-level')) + 1 + '-floor';
      var isParking = $('body #' + locIDStr).closest('.mapplic-layer').attr('data-isParking');
      var separation = $('body #' + locIDStr).closest('.mapplic-layer').attr('data-separation');
      var location;
      var build = $(this).attr('data-build-cat');
      CTX.listFloorTransports = $('body .mapplic-layer[data-floor="' + floor + '"][data-build="' + build + '"]').find('.lift');

      var levelObj = CTX.data.levels[build - 1][parseInt($(this).attr('data-level'))].locations;
      for (var i = 0; i < levelObj.length; i++) {
        if (levelObj[i].id == $(this).attr('data-id')) {
          location = levelObj[i];
          break;
        }
      }
      
      // console.log(this.TerminalBuild, this.TerminalFloor, this.Terminal);
      if (!location.id.includes('terminal')) {
        // Проверка нахождение терминала и локации, если false то выбор транспорта не нужен
        /*     var checkLvl = (parseInt(TerminalBuild) + parseInt(TerminalFloor) !== parseInt(build) + parseInt(floor));
                if (checkLvl) {
                        if (openSelectTransport(listFloorTransports)) {
                            $(document).on('click touchstart', '.select-transport-click', function () {
                                transportMove = $(this).attr('data-transport');
                                stepPopupLoc = false;
                                $(popupMapRoute).fadeOut(300);
                                $(cartTransport).fadeOut(300);
                                locPopupInit(location, floor, isParking, build, separation);
                        });
                    } else {
                        locPopupInit(location, floor, isParking, build, separation);
                        stepPopupLoc = true;
                    }
                } else { */
        CTX.transportMove = null;
        CTX.locPopupInit(location, floor, isParking, build, separation);
        /*  } */
      }
    });
    $(document).on('click touchstart', '#search-map', function (e) {
      // e.preventDefault();
      $('body .open-filtered-locations-category').trigger('click');
    });
    $(document).on('click touchstart', '#search-choose-right', function (e) {
      // e.preventDefault();
      $('body .open-filtered-locations-category').trigger('click');
    });
    $(document).on('blur', '#search-locations-with-tags', function (e) {
      if (CTX.isIos()) {
        $('body .btn-category').removeClass('fixfixed');
      }
    });
    $(document).on('focus', '#search-locations-with-tags', function (e) {
      if (CTX.isIos()) {
        $('body .btn-category').addClass('fixfixed');
      }
    });
    $(document).on('click', '#cancel-search-filter-locations', function () {
      $('body #search-locations-with-tags').val('');
      
      if ($(CTX.screenLocationsFilteredWithBtnCategory).hasClass('show-tags')) {
        $(CTX.menuListFilteredLocations).html('');
        for (var b = 0; b < CTX.data.levels.length; b++) {
          for (var i = 0; i < CTX.data.levels[b].length; i++) {
            CTX.locationUseCase.buildFilteredLocations(CTX.data.levels[b][i].locations, i);
          }
        }
        setTimeout(function () {
          CTX.tagsUseCase.getFilteredTagsAndBuild(CTX.data.tags);
        }, 300);
        
        $(CTX.screenLocationsFilteredWithBtnCategory).removeClass('show-tags');
      } else {
        $('body #search-locations-with-tags').trigger('keyup');
      }
    });
    $(document).on('click', '.open-locations-by-category', function () {
      let categorySlug = $(this).attr('data-id');
      let categoryNameBlock = $(this).attr('data-title');
      $('body #menu-list-categories-filtred').html('');
      var li = `<li class="cat-btn">
                        <div class="item-category">
                          
                            <div class="name-category">
                              <span class="name-cat-filtred">${categoryNameBlock}</span>
                              
                            </div>
                            
                          </div>
                        </div>
                      </li>`;
      
      $('body #menu-list-categories-filtred').append(li);
      
      CTX.prevScreen = $('body .screen.active').attr('id');
      console.log(CTX.prevScreen);
      if (
        $(this)
          .closest('.screen')
          .attr('id') !== $(CTX.screenLocationsFilteredWithBtnCategory).attr('id')
      ) {
        CTX.mapSwitch.switchScreen(CTX.screenLocationsFilteredWithBtnCategory);
      }
      /*  $(screenLocationsFilteredWithBtnCategory).addClass('show-tags'); */
      var backbtn = $(CTX.screenLocationsFilteredWithBtnCategory).find('.click-back-btn');
      $(backbtn).attr('data-screen-to-switch', CTX.prevScreen);
      
      $(CTX.menuListFilteredLocations).html('');
      for (let b = 0; b < CTX.data.levels.length; b++) {
        for (let i = 0; i < CTX.data.levels[b].length; i++) {
          let tempLevel = CTX.data.levels[b][i];
          var locationsCategory = [];
          
          for (let x = 0; x < tempLevel.locations.length; x++) {
            if (tempLevel.locations[x].category === categorySlug) {
              locationsCategory.push(tempLevel.locations[x]);
            }
          }
          CTX.locationUseCase.buildFilteredLocationsIndividual(locationsCategory, i, '#menu-list-filtered-locations-and-tags');
        }
      }
      $('body #menu-list-filtered-locations-and-tags li:even').addClass('not-even');
    });
    $(document).on('click', '.open-locations-by-tag', function () {
      let tag = $(this).attr('data-tag-name');
      
      if (
        $(this)
          .closest('.screen')
          .attr('id') !== $(CTX.screenLocationsFilteredWithBtnCategory).attr('id')
      ) {
        CTX.mapSwitch.switchScreen(CTX.screenLocationsFilteredWithBtnCategory);
      }
      $(CTX.screenLocationsFilteredWithBtnCategory).addClass('show-tags');
      
      $(CTX.menuListFilteredLocations).html('');
      for (let b = 0; b < CTX.data.levels.length; b++) {
        for (let i = 0; i < CTX.data.levels[b].length; i++) {
          let tempLevel = CTX.data.levels[b][i];
          var locationsTags = [];
          
          for (let x = 0; x < tempLevel.locations.length; x++) {
            if (tempLevel.locations[x].tags.includes(tag)) {
              locationsTags.push(tempLevel.locations[x]);
            }
          }
  
          CTX.locationUseCase.buildFilteredLocations(locationsTags, i);
        }
      }
    });
    $(document).on('keyup', '#search-locations-with-tags', function () {
      let itemNameForSearch = $('body .name-loc');
      
      CTX.general.search(
        $(CTX.searchFilteredLocationsWithTags).attr('id'),
        $(CTX.menuListFilteredLocations).attr('id'),
        $(itemNameForSearch).attr('class')
      );
    });
    $(document).on('click', '.open-filtered-locations-category', function () {
      $('body #cancel-search-filter-locations').trigger('click');
      
      if (!$(CTX.screenLocationsFilteredWithBtnCategory).hasClass('show-tags')) {
        CTX.mapSwitch.switchScreen(CTX.screenLocationsFilteredWithBtnCategory);
      } else {
        $(CTX.screenLocationsFilteredWithBtnCategory).removeClass('show-tags');
      }
      
      // var duration = 500;
      // $({to:0}).animate({to:1}, duration, function() {
      //     $(searchFilteredLocationsWithTags).focus();
      // });
      
      setTimeout(CTX.focusInput().bind(this), 500);
    });
    $(document).on('click', '#floors', function () {
      let floors = $('body #floor-block').find('li');
      /* $('#floors-list').html('') */
      
      /* for (let a = floors.length; a >= 0; a--) {
      
        $('#floors-list').append(floors[a]);
      } */
      // if ($(floors[2]).attr('data-value') == '3-floor') {
      //   $(floors[0]).before(floors[2]);
      //   $(floors[2]).css('margi-right', '50%');
      //   $(floors[2]).css('margin-top', '0');
      // }
      
      $('body #floor-block').fadeIn(200);
    });
    $(document).on('click', '#hide-floors', function () {
      $('body #floor-block').fadeOut(200);
    });
    $(document).on('click', '.open-qr-scanner', function () {
      CTX.clearModule();
    });
    // $(document).on('click', '.level-select', function() {
    //   console.log('my click =-=-=-=')
    //   $(this).addClass('active-floor');
    //   $(this).siblings().removeClass('active-floor');
    // })
  }
  
  getDefaultNumBuild() {
    var enableBlock = $('body #enable-file-build');
    
    if ($(enableBlock).attr('data-active-build-temp')) {
      return $(enableBlock).attr('data-active-build-temp');
    } else {
      return $(enableBlock).attr('data-active-build');
    }
  }

  locPopupInit(location, floor, isParking = false, defaultNumBuild = false, separation = false, offer = false) {
    // Функция отображения попапа
    if (!location.id.includes('terminal')) {
      // if (offer) {
      //   mapSwitch.switchScreen(screenOffer);
      //   offerUseCase.buildOfferDetail(offer, location, floor, defaultNumBuild, isParking, separation);
      // } else {
      //   let prevscreen = $('body .screen.active').attr('id');
      //   mapSwitch.switchScreen(screenLocationDetail);
      //
      //   $($(screenLocationDetail).find('.click-back-btn')).attr('data-screen-to-switch', prevscreen);
      //
      //   locationUseCase.buildLocationDetail(location, floor, defaultNumBuild, isParking, separation);
      // }
    }
  }
  
  openSelectTransport(listFloorTransports, name_of_loc, CTX = this) {
    var typesTransports = [];
    var selectedLift = true;
    var selectedEscalator = true;
    
    $('body #screen-map .header-two').css('background', 'transparent');
    $('body #screen-map .header-top-left-second').css('border', '1px solid rgba(255, 255, 255, 0.3)');
    $('body #screen-map .header-top-left-second > span > img').attr('src', arrowWhiteSvg);
    $('body #screen-map .header-logo > img').attr('src', lavinaWhiteSvg);
    $('body .start-route-shop-name').html(name_of_loc);
    
    for (var i = 0; i < listFloorTransports.length; i++) {
      if (selectedLift) {
        if ($(listFloorTransports[i]).hasClass('r_lift')) {
          typesTransports.push(this.TRANSPORT_LIFT);
          selectedLift = false;
        }
      }
      
      if (selectedEscalator) {
        if ($(listFloorTransports[i]).hasClass('escalator')) {
          typesTransports.push(this.TRANSPORT_ESCALATOR);
          selectedEscalator = false;
        }
      }
    }
    // if (typesTransports.length <= 1) {
    //   CTX.transportMove = typesTransports[0];
    //   return false;
    // }
    console.log('DOSHLO DO FADEIN');
    // for (var n = 0; n < typesTransports.length; n++) {
    //   var nameTransport = CTX.listTransport[typesTransports[n]];
    //   if (typesTransports[n] == "escalator") {
    //     $("#popup-map-route #select-transport").append(
    //         '<span class="btn-send-report select-transport-click" data-transport="' + typesTransports[n] + '"><span class="icon-item-action-way">IMAGE</span><span class="transport-text">' + nameTransport + '</span></span>'
    //     );
    //   }
    //   else {
    //     $("#popup-map-route #select-transport").append(
    //         '<span class="btn-send-report select-transport-click" data-transport="' + typesTransports[n] + '"><span class="transport-text second">' + nameTransport + '</span><span class="icon-item-action-way">typesTransports[n] </span></span>'
    //     );
    //   }
    // }
    // TODO 1
    // $(CTX.popupMapRoute).fadeIn(300);
    // $(CTX.cartTransport).fadeIn(300);
    $('body #popup-map-route').fadeIn(300);
    $('body #cart-transport').fadeIn(300);
    return true;
  }
  
  appendTextDirection(direction, numberFloor = false, CTX = this) {
    if (direction) {
      $('body #help-route-text').html('');
      if (direction.includes('escalator')) {
        $('body #lift-image').css('display', 'none');
        $('body #escalator-image').css('display', 'block');
      } else {
        $('body #escalator-image').css('display', 'none');
        $('body #lift-image').css('display', 'block');
      }
      var textForView = CTX.directionsTips[direction];
      
      if (numberFloor) {
        textForView = textForView.replace('{numberFloor}', numberFloor);
        // textForView = "test";

      }
      
      $('body #help-route-text').html(textForView);
    }
  }
  
  messageDelay(direction) {
    console.log(direction);
    $('body .popups')
      .addClass('active')
      .find('.directions')
      .addClass('active ' + direction);
  }
  
  continueRoute(arrayIterations, i, openBuild = false, prevLoc, CTX = this) {
    $('body #popup-map-route').addClass('continue-route');
    
    var floor, placeID, build, direction, placeType, moveWay;

    floor = arrayIterations[i].floor;
    placeID = arrayIterations[i].placeId;
    build = arrayIterations[i].build;
    placeType = arrayIterations[i].placeType;
    moveWay = arrayIterations[i].moveWay;
    direction = CTX.identifyDirection(placeType, moveWay);

    if (openBuild) {
      CTX.enableBuild(build);
    }
    
    if (placeType === 'exit' || placeType === 'finish') {
      CTX.appendTextDirection(direction);
    } else {
      if (arrayIterations[i + 1]) {
        CTX.appendTextDirection(direction, arrayIterations[i + 1].floor);
      }
    }
    
    $('body .level-select[data-build=' + build + '][data-value=' + floor + '-floor]').trigger('click');
    
    if (placeType === 'finish') {
      $('body .btn-circle-menu').fadeIn(300);
      CTX.map.data('mapplic').showLocation(placeID, 100);
    }
    
    console.log(floor, placeID, prevLoc);
    CTX.buildLvlLinesTree(floor + '-floor', placeID, prevLoc ? prevLoc : false);
    
    if (placeType === 'finish') {
      $('body .btn-circle-menu').fadeIn(300);
      return 'finish';
    } else {

      $('#cart-transport').fadeOut(10)
      $('#popup-map-route').fadeIn(300)
      $('#cart-help-route').fadeIn(600)
      $('body .block-help-text').fadeIn(600);

      setTimeout(function () {
        $('#cart-help-route').fadeOut(10)
      }, 3990)

      setTimeout(function () {
        $('#cart-tip-route').fadeIn(300)
        $('#btn-route-continue').fadeIn(300);

      }, 4000);
      
      return placeID;
    }
  }
  
  buildAnimationRoute(terminalBuildArray, locationBuildArray = false, CTX = this) {
    var firstBuild = true;
    var prevLoc = false;
    var click = 0;

console.log(locationBuildArray, "LOCATION BUILD |||||||||")
    CTX.enableBuild(CTX.TerminalBuild);
    $('body .level-select[data-build=' + CTX.TerminalBuild + '][data-value=' + CTX.TerminalFloor + ']').trigger('click');
    
    if (terminalBuildArray.length !== click + 1 || locationBuildArray) {
      setTimeout(function () {
        prevLoc = CTX.continueRoute(terminalBuildArray, click);
        click = click + 1;
      }, 500);
      
      $(document).on('click touchstart', '.btn-route-continue-go', function () {
        $('#cart-tip-route').fadeOut(10)
        // $(CTX.popupMapRoute).fadeOut(200);
        // $(CTX.cartTipRoute).fadeOut(200);
        // $(CTX.btnRouteContinue).fadeOut(200);
        $('#popup-map-route').fadeOut(200);
        // $('#cart-tip-route').fadeOut(200);
        $('#btn-route-continue').fadeOut(200);
        console.log('-------------------', click);
        if (firstBuild) {
          // console.log(terminalBuildArray.length, click, 123);
          if (terminalBuildArray.length === click) {
            click = 0;
            firstBuild = false;
            
            if (locationBuildArray.length) {
              console.log(click, 'iteration second build FIRST', prevLoc);
              // first iteration second build
              prevLoc = CTX.continueRoute(locationBuildArray, click, true, prevLoc);
              click++;
            }
          } else {
            console.log(click, 'iteration first build', prevLoc);
            prevLoc = CTX.continueRoute(terminalBuildArray, click, false, prevLoc);
            if (prevLoc === 'finish') {
              click = 0;
              // $('body .btn-circle-menu').fadeIn(300);
            } else {
              click++;
            }
          }
        } else {
          if (locationBuildArray.length) {
            console.log('second build route', click, prevLoc);
            
            prevLoc = CTX.continueRoute(locationBuildArray, click, false, prevLoc);
            click++;
            // if (prevLoc == 'finish') $('body .btn-circle-menu').fadeIn(300);
          }
        }
      });
    } else {
      CTX.map.data('mapplic').showLocation(terminalBuildArray[click].placeId, 100);
      CTX.buildLvlLinesTree(terminalBuildArray[click].floor + '-floor', terminalBuildArray[click].placeId, prevLoc ? prevLoc : false);
    }
  }
  
  multiNum(a, b) {
    var num = 0;
    for (var i = 0; i < b; i++) {
      num = num + a * (b - i);
    }
    
    console.log(num);
    return num;
  }
  
  identifyDirection(placeType, moveWay) {
    var direction;
    
    if (placeType === 'finish' || placeType === 'start') {
      direction = false;
    } else if (placeType === 'exit') {
      direction = placeType;
    } else {
      direction = moveWay ? 'up_' + placeType : 'down_' + placeType;
    }
    
    return direction;
  }
  
  enableBuild(build) {
    var buildSelector = $('body .build[data-build-btn=' + build + ']');
    
    $(buildSelector).attr('loc-change', true);
    $(buildSelector).trigger('click');
  }
  
  startBuildRoute(
    fromElement,
    fromElementFloorINT,
    toElementLevelINT,
    toElementId,
    placeType,
    buildFromElementINT,
    buildToElementINT,
    CTX = this
  ) {
    

    var arr = [];
    var currentMapplic = $('body .mapplic-layer.idle-layer[data-build=' + buildFromElementINT + '][data-floor=' + fromElementFloorINT + '-floor]');
    // SR

    
    var fromElementObj =  fromElement.includes('terminal') ? $('#0_'+fromElement) : $(currentMapplic).find('#line_'+fromElement);
    var toElementObj = toElementId.includes('terminal') ? $('#0_'+toElementId) : $(currentMapplic).find('#line_'+toElementId);
   
    
    var typesTransports = [CTX.TRANSPORT_LIFT, CTX.TRANSPORT_ESCALATOR];
    var check;
    
    if (buildToElementINT !== buildFromElementINT) {
      check = CTX.checkIsLastLocation(fromElementFloorINT, toElementLevelINT, toElementId, fromElement);
    } else {
      check = CTX.checkIsLastLocation(fromElementFloorINT, toElementLevelINT, toElementId);
    }
  
    // check is last location and can building route to loc
    if (check) {
      arr.push({
        floor: toElementLevelINT,
        placeId: toElementId,
        build: buildFromElementINT,
        moveWay: fromElementFloorINT < toElementLevelINT,
        placeType: $('body #line_' + toElementId).hasClass('exit') ? 'exit' : 'finish'
      });
      
      return arr;
    }
    
    var index = typesTransports.indexOf(placeType);
    typesTransports.splice(index, 1);
    typesTransports.unshift(placeType);
    
    placeType = typesTransports[0];
    
    for (var k = 0; k < typesTransports.length; k++) {
      var transportElements = CTX.getTransportElements(buildFromElementINT, fromElementFloorINT, typesTransports[k]);
      if (transportElements.length !== 0) {
        placeType = typesTransports[k];
        break;
      }
    }
    
     var moveWayType = fromElementFloorINT < toElementLevelINT;
    // var moveWayType;
    // if (fromElementFloorINT < toElementLevelINT) {
    //   moveWayType = 'up';
    // } else {
    //   moveWayType = 'down';
    // }
    // console.log('AB AB AB => ', transportElements[0], fromElementObj[0]);
    var sortElements = CTX.sortElementsByDistance(transportElements, fromElementObj, moveWayType, placeType);
    
    var changePlaceType = false;
    var noTransportChangePlace = true;
    for (var i = 0; i < sortElements.length; i++) {
      var closestEscalator = sortElements[i].id.replace('line_', '');

      if (
        CTX.canBuildLvlLinesTree(
          fromElementFloorINT + '-floor',
          closestEscalator,
          buildToElementINT !== buildFromElementINT ? fromElement : false
        )
      ) {
        var offset = -1;
        noTransportChangePlace = false;
        if (placeType === CTX.TRANSPORT_ESCALATOR) {
          if ($(sortElements[i]).hasClass('up')) {
            offset = 1;
          }
        } else {
          offset = CTX.searchNextFloorOffset(
            buildFromElementINT,
            fromElementFloorINT,
            toElementLevelINT,
            fromElementFloorINT < toElementLevelINT,
            closestEscalator
          );
          
          if (!offset) {
            changePlaceType = true;
            break;
          }
        }
        
        var elemObj = $('body #line_' + closestEscalator);
        console.log('ROUTE 1766 elemObj', elemObj);
        
        arr.push({
          floor: fromElementFloorINT,
          placeId: closestEscalator,
          build: buildFromElementINT,
          moveWay: fromElementFloorINT < toElementLevelINT,
          placeType: $(elemObj).hasClass('exit') ? 'exit' : placeType
        });
  
        CTX.buildRouteTree(
          buildFromElementINT,
          fromElementFloorINT + offset,
          closestEscalator,
          placeType,
          arr,
          toElementLevelINT,
          toElementId,
          buildFromElementINT,
          typesTransports
        );
        
        if (arr.length !== 1) {
          break;
        } else {
          arr.pop();
        }
      }
      
      if (i === sortElements.length - 1 && noTransportChangePlace) {
        changePlaceType = true;
        break;
      }
    }
    
    // change place and build again
    if (changePlaceType) {
      // change place
      var index = typesTransports.indexOf(placeType);
      typesTransports.splice(index, 1);
      typesTransports.push(placeType);
      placeType = typesTransports[0];
      
      //build route again
      arr = CTX.startBuildRoute(
        fromElement,
        fromElementFloorINT,
        toElementLevelINT,
        toElementId,
        placeType,
        buildFromElementINT,
        buildToElementINT
      );
    }
  
    return arr;
  }
  
  searchNextFloorOffset(buildFromElementINT, fromElementFloorINT, toElementLevelINT, moveWay, liftId) {
    var isLiftContinue;
    if (moveWay) {
      for (var j = toElementLevelINT; j !== fromElementFloorINT; j--) {
        isLiftContinue = $('body .mapplic-layer.idle-layer[data-build=' + buildFromElementINT + '][data-floor=' + j + '-floor]').find(
          '#line_' + liftId
        );
        
        if (isLiftContinue.length !== 0) {
          return j - fromElementFloorINT;
        }
      }
    } else {
      for (var i = toElementLevelINT; i < fromElementFloorINT; i++) {
        isLiftContinue = $('body .mapplic-layer.idle-layer[data-build=' + buildFromElementINT + '][data-floor=' + i + '-floor]').find(
          '#line_' + liftId
        );
        
        if (isLiftContinue.length !== 0) {
          return (fromElementFloorINT - i) * -1;
        }
      }
    }
    
    return 0;
  }
  
  buildRouteTree(build, floor, placeId, placeType, arr, toElementLevelINT, locId, buildFromElementINT, typesTransports) {
    var currentMapplic = $('body .mapplic-layer.idle-layer[data-build=' + build + '][data-floor=' + floor + '-floor]');
    var placeElement = $(currentMapplic).find('#line_' + placeId);
    // check is last location and can building route to loc
    if (this.checkIsLastLocation(floor, toElementLevelINT, locId, placeId)) {
      arr.push({
        floor: toElementLevelINT,
        placeId: locId,
        build: buildFromElementINT,
        moveWay: floor < toElementLevelINT,
        placeType: $('body #line_' + locId).hasClass('exit') ? 'exit' : 'finish'
      });
      
      return;
    }
    
    placeType = typesTransports[0];
    
    for (var k = 0; k < typesTransports.length; k++) {
      var transportElements = this.getTransportElements(build, floor, typesTransports[k], placeElement);
      if (transportElements.length !== 0) {
        placeType = typesTransports[k];
        break;
      }
    }
    
    var moveWayType = floor < toElementLevelINT;
    // sort elements by distance
    var sortElements = this.sortElementsByDistance(transportElements, placeElement, moveWayType, placeType);
    
    for (var i = 0; i < sortElements.length; i++) {
      var closestEscalator = sortElements[i].id.replace('line_', '');
      
      // if record has already exist in array, ignore
      var ignore = this.isNeedIgnore(arr, closestEscalator, floor);
      
      if (!ignore && this.canBuildLvlLinesTree(floor + '-floor', closestEscalator, placeId)) {
        var elemObj = $('body #line_' + closestEscalator);
        arr.push({
          floor: floor,
          placeId: closestEscalator,
          build: buildFromElementINT,
          moveWay: floor < toElementLevelINT,
          placeType: $(elemObj).hasClass('exit') ? 'exit' : placeType
        });
        
        var prevArrLength = arr.length;
        
        var offset = -1;
        
        if (placeType === this.TRANSPORT_ESCALATOR) {
          if ($(sortElements[i]).hasClass('up')) {
            offset = 1;
          }
        } else {
          offset = this.searchNextFloorOffset(buildFromElementINT, floor, toElementLevelINT, floor < toElementLevelINT, closestEscalator);
        }
        
        this.buildRouteTree(
          build,
          floor + offset,
          closestEscalator,
          placeType,
          arr,
          toElementLevelINT,
          locId,
          buildFromElementINT,
          typesTransports
        );
        
        if (arr.length !== prevArrLength) {
          break;
        } else {
          arr.pop();
        }
      }
    }
  }
  
  isNeedIgnore(arr, closestEscalator, floor) {
    var ignore = false;
    
    for (var j = 0; j < arr.length; j++) {
      var a1 = parseInt(arr[j].floor) === parseInt(floor);
      var a2 = arr[j].placeId === closestEscalator;
      
      if (a1 && a2) {
        ignore = true;
        break;
      }
    }
    
    return ignore;
  }
  
  checkIsLastLocation(formElementLevelINT, toElementLevelINT, locId, placeId = false) {
    if (formElementLevelINT === toElementLevelINT) {
      if (placeId) {
        if (this.canBuildLvlLinesTree(toElementLevelINT + '-floor', locId, placeId)) {
          return true;
        }
        // add mark that separation floor
        else {
          this.separationFloor = true;
        }
      } else {
        if (this.canBuildLvlLinesTree(toElementLevelINT + '-floor', locId)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  getTransportElements(buildINT, floorINT, transport, exceptElem = false) {
    var transportElements;
    
    if (transport === this.TRANSPORT_LIFT) {
      transportElements = !exceptElem
        ? $('body .mapplic-layer.idle-layer[data-build=' + buildINT + '][data-floor=' + floorINT + '-floor] .r_lift')
        : $('body .mapplic-layer.idle-layer[data-build=' + buildINT + '][data-floor=' + floorINT + '-floor] .r_lift').not($(exceptElem));
    } else if (transport === this.TRANSPORT_ESCALATOR) {
      transportElements = !exceptElem
        ? $('body .mapplic-layer.idle-layer[data-build=' + buildINT + '][data-floor=' + floorINT + '-floor] .escalator')
        : $('body .mapplic-layer.idle-layer[data-build=' + buildINT + '][data-floor=' + floorINT + '-floor] .escalator').not($(exceptElem));
    } else {
      transportElements = !exceptElem
        ? $('body .mapplic-layer.idle-layer[data-build=' + buildINT + '][data-floor=' + floorINT + '-floor] .escalator')
        : $('body .mapplic-layer.idle-layer[data-build=' + buildINT + '][data-floor=' + floorINT + '-floor] .escalator').not($(exceptElem));
    }
    
    return transportElements;
  }
  
  sortElementsByDistance(elements, toElement, moveWayType = false, placeType = false, CTX = this) {
    var sortDisArr = [];
    var sortElemArr = [];
    var sortArr = [];
    
    for (var i = elements.length; i--;) {
      var fromElement = elements[i];
      
      if (fromElement == toElement) {
        continue;
      }
      var distance = CTX.getDistanceBetweenElements(toElement, fromElement);

      // todo correct sort elements
      sortDisArr.push(distance);
      sortElemArr.push(fromElement);
    }
    
    CTX.sortArr = CTX.bubbleSort(sortDisArr, sortElemArr);
    var sort = [];
    if (placeType === CTX.TRANSPORT_ESCALATOR) {
      for (var j = 0; j < CTX.sortArr.length; j++) {
        if ($(CTX.sortArr[j]).hasClass("up")) {
          sort.unshift(CTX.sortArr[j]);
        } else {
          sort.push(CTX.sortArr[j]);
        }
      }
    } else {
      sort = CTX.sortArr;
    }
    
    return sort;
  }
  
  bubbleSort(arr, arr2) {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      for (var j = 1; j <= i; j++) {
        if (arr[j - 1] > arr[j]) {
          var temp = arr[j - 1];
          var temp2 = arr2[j - 1];
          
          arr[j - 1] = arr[j];
          arr2[j - 1] = arr2[j];
          
          arr2[j] = temp2;
          arr[j] = temp;
        }
      }
    }
    
    return arr2;
  }

// BUTTON TO BOTTOM
  
  getPositionAtCenter(element) {
    // if (element instanceof jQuery) {
    //   element = element.get(0);
    // } else {
    //   // console.log(element.x1.baseVal.value);
    //   // console.log("DATA X");
    // }
    // var data = element.getBoundingClientRect();
    var checkElement = element instanceof Node ? element : element[0];
    // console.log('getPositionAtCenter element => ', element, checkElement);
    
    return {
      x: checkElement.x1.baseVal.value + checkElement.x2.baseVal.value / 2,
      y: checkElement.y1.baseVal.value + checkElement.x2.baseVal.value / 2
    };
  }
  
  getDistanceBetweenElements(a, b) {
    // console.log('getDistanceBetweenElements a, b => ', a, b);
    var aPosition = this.getPositionAtCenter(a);
    var bPosition = this.getPositionAtCenter(b);
    // console.log(aPosition);
    // console.log(bPosition);
    
    return Math.sqrt(Math.pow(aPosition.x - bPosition.x, 2) + Math.pow(aPosition.y - bPosition.y, 2));
  }
  
  canBuildLvlLinesTree(lvlId, shopId, direction = false, CTX = this) {
    try {
      CTX.buildLvlLinesTree(lvlId, shopId, direction, false);
      return true;
    } catch (error) {
      console.log('canBuildLvlLinesTree => buildLvlLinesTree error is:', error);
      return false;
    }
  }
  
  // trytr
  getBuildTempOrCurrent(tempBuild, CTX = this) {
    if (CTX.tempNumBuild) {
      return tempBuild;
    } else {
      return this.getDefaultNumBuild();
    }
  }
   getDefaultNumBuild() {
    var enableBlock = $('#enable-file-build');

    if ($(enableBlock).attr('data-active-build-temp')) {
      return $(enableBlock).attr('data-active-build-temp');
    } else {
      return $(enableBlock).attr('data-active-build');
    }
  }

  initCatImgFiltration(CTX = this) {
    // Инициализация фильтрации по клику на картинку локации из карусели
    $('body .cat-img').on('click', function () {
      CTX.tempNumBuild = true;
      var isParking = $(this)
        .closest('.mapplic-layer')
        .attr('data-isParking');
      var separation = $(this)
        .closest('.mapplic-layer')
        .attr('data-separation');
      
      var defaultNumBuild = CTX.getBuildTempOrCurrent($(this).attr('data-build-cat'));
      
      CTX.listFloorTransports = $(
        '.mapplic-layer[data-floor="' + $(this).attr('data-level') + '-floor"][data-build="' + $(this).attr('data-build-cat') + '"]'
      ).find('.lift');
      var location;
      var build = $(this).attr('data-build-cat');
      var floor = parseInt($(this).attr('data-level')) + 1 + '-floor';
      var levelObj = CTX.data.levels[build - 1][parseInt($(this).attr('data-level'))].locations;
      for (var i = 0; i < levelObj.length; i++) {
        if (levelObj[i].id == $(this).attr('data-id')) {
          location = levelObj[i];
          break;
        }
      }
      $('body #' + location.id + '.mapplic-clickable').trigger('click');
      
      $('body .mapplic-colored').attr('style', 'fill: ' + CTX.fill);
      $('body .mapplic-colored').removeClass('mapplic-colored');
      $('body .mapplic-highlighted').removeClass('mapplic-highlighted');
      $('body #' + $(this).attr('data-id')).addClass('mapplic-highlighted');
      if ($('body .map-cover').hasClass('hidden')) {
        CTX.map.data('mapplic').hideLocation();
        CTX.map.data('mapplic').showLocation($(this).attr('data-id'), 1000);
      }
    });
  }
  
  initDefaultBtnsATM(selector, category, color, CTX = this) {
    // Инициализация статичных кнопок (туалет, атм)
    $(selector).on('click', function () {
      for (var b = 0; b < CTX.data.levels.length; b++) {
        for (var i = 0; i < CTX.data.levels[b].length; i++) {
          $('#rootsPath-' + (i + 1) + '-' + (b + 1)).html('');
        }
      }
      $('body .mapplic-colored').attr('style', 'fill: ' + CTX.fill);
      $('body .mapplic-colored').removeClass('mapplic-colored');
      $('body .mapplic-highlighted').removeClass('mapplic-highlighted');
      $('body .myborder.active')
        .attr('style', '')
        .removeClass('active');
      $(this)
        .addClass('active')
        .css('background', color);
      var tempHtml = '';
      
      for (var b = 0; b < CTX.data.levels.length; b++) {
        for (var i = 0; i < CTX.data.levels[b].length; i++) {
          for (var x = 0; x < CTX.data.levels[b][i].locations.length; x++) {
            var tempLoc = CTX.data.levels[b][i].locations[x];
            
            if (tempLoc.id == 'ATM' || tempLoc.id == 'ATM1' || tempLoc.id == 'ATM2' || tempLoc.id == 'ATM3' || tempLoc.id == 'ATM4') {
              $('body #' + tempLoc.id).addClass('mapplic-colored');
              tempHtml +=
                "<div class='cat-img' data-name='" +
                tempLoc.title +
                "' data-build-cat='" +
                (b + 1) +
                "' data-level='" +
                i +
                "' data-iter='" +
                x +
                "' data-id='" +
                tempLoc.id +
                "'><img src='" +
                CTX.framePath +
                tempLoc.icon +
                "'></div>";
            }
          }
        }
      }
      $('body .mapplic-colored').attr('style', 'fill: ' + color);
      $('body .cat-img').unbind('click');
      $('body .owl-carousel')
        .trigger('replace.owl.carousel', tempHtml)
        .trigger('refresh.owl.carousel');
      CTX.initCatImgFiltration();
      $('body .custom-clear').trigger('click');
    });
  }
  
  initDefaultBtns(selector, category, color, CTX = this) {
    // Инициализация статичных кнопок (туалет, атм)
    $(selector).on('click', function () {
      for (var b = 0; b < CTX.data.levels.length; b++) {
        for (var i = 0; i < CTX.data.levels[b].length; i++) {
          $('body #rootsPath-' + (i + 1) + '-' + (b + 1)).html('');
        }
      }
      $('body .mapplic-colored').attr('style', 'fill: ' + CTX.fill);
      $('body .mapplic-colored').removeClass('mapplic-colored');
      $('body .mapplic-highlighted').removeClass('mapplic-highlighted');
      $('body .myborder.active')
        .attr('style', '')
        .removeClass('active');
      $(this)
        .addClass('active')
        .css('background', color);
      var tempHtml = '';
      
      for (var b = 0; b < CTX.data.levels.length; b++) {
        for (var i = 0; i < CTX.data.levels[b].length; i++) {
          for (var x = 0; x < CTX.data.levels[b][i].locations.length; x++) {
            var tempLoc = CTX.data.levels[b][i].locations[x];
            if (tempLoc.id == 'WC1' || tempLoc.id == 'WC2' || tempLoc.id == 'WC3' || tempLoc.id == 'WC4') {
              $('body #' + tempLoc.id).addClass('mapplic-colored');
              tempHtml +=
                "<div class='cat-img' data-name='" +
                tempLoc.title +
                "' data-build-cat='" +
                (b + 1) +
                "' data-level='" +
                i +
                "' data-iter='" +
                x +
                "' data-id='" +
                tempLoc.id +
                "'><img src='" +
                CTX.framePath +
                tempLoc.icon +
                "'></div>";
            }
          }
        }
      }
      $('body .mapplic-colored').attr('style', 'fill: ' + color);
      $('body .cat-img').unbind('click');
      $('body .owl-carousel')
        .trigger('replace.owl.carousel', tempHtml)
        .trigger('refresh.owl.carousel');
      CTX.initCatImgFiltration();
      $('body .custom-clear').trigger('click');
    });
  }
  
  initCatBtnFunctionality(CTX = this) {
    // Инициализация ивенов кнопок категий в верхней навигации
    $('body .cat-btn').on('click', function () {
      for (var b = 0; b < CTX.data.levels.length; b++) {
        for (var i = 0; i < CTX.data.levels[b].length; i++) {
          $('#rootsPath-' + (i + 1) + '-' + (b + 1)).html('');
        }
      }
      $('body .mapplic-colored').attr('style', 'fill: ' + CTX.fill);
      $('body .mapplic-colored').removeClass('mapplic-colored');
      $('body .mapplic-highlighted').removeClass('mapplic-highlighted');
      $('body .myborder.active')
        .attr('style', '')
        .removeClass('active');
      // $(this).addClass("active").css("background", Data.categories[$(this).attr("data-iter")].color);
      var tempHtml = '';
      for (var b = 0; b < CTX.data.levels.length; b++) {
        for (var i = 0; i < CTX.data.levels[b].length; i++) {
          for (var x = 0; x < CTX.data.levels[b][i].locations.length; x++) {
            var tempLoc = CTX.data.levels[b][i].locations[x];
            if (tempLoc.category == $(this).attr('data-id')) {
              $('body #' + tempLoc.id).addClass('mapplic-colored');
              tempHtml +=
                "<div class='cat-img' data-name='" +
                tempLoc.title +
                "' data-level='" +
                i +
                "' data-build-cat='" +
                (b + 1) +
                "' data-iter='" +
                x +
                "' data-id='" +
                tempLoc.id +
                "'><img src='" +
                CTX.framePath +
                tempLoc.icon +
                "'></div>";
            }
          }
        }
      }
      $('body.mapplic-colored').attr('style', 'fill: ' + $(this).attr('data-color'));
      $('body.cat-img').unbind('click');
      $('body.owl-carousel')
        .trigger('replace.owl.carousel', tempHtml)
        .trigger('refresh.owl.carousel');
      CTX.initCatImgFiltration();
      $('body.custom-clear').trigger('click');
    });
  }
  
  carouselAllShops(CTX = this) {
    $('body .cat-img').unbind('click');
    for (var b = 0; b < CTX.data.levels.length; b++) {
      for (var i = 0; i < CTX.data.levels[b].length; i++) {
        $('#rootsPath-' + (i + 1) + '-' + (b + 1)).html('');
      }
    }
    $('body .mapplic-colored').attr('style', 'fill: ' + CTX.fill);
    $('body .mapplic-colored').removeClass('mapplic-colored');
    $('body .mapplic-highlighted').removeClass('mapplic-highlighted');
    $('body .myborder.active')
      .attr('style', '')
      .removeClass('active');
    var shops = '';
    for (var b = 0; b < CTX.data.levels.length; b++) {
      for (var i = 0; i < CTX.data.levels[b].length; i++) {
        var tempLevel = CTX.data.levels[b][i];
        for (var y = 0; y < CTX.data.levels[b][i].locations.length; y++) {
          var tempLoc = CTX.data.levels[b][i].locations[y];
          if (tempLoc.category != 'terminal') {
            // Создание массива всех локаций, кроме терминалов и туалетов
            $('body #' + tempLoc.id).addClass('mapplic-colored');
            shops +=
              "<div class='cat-img' data-name='" +
              tempLoc.title +
              "' data-build-cat='" +
              (b + 1) +
              "' data-level='" +
              i +
              "' data-iter='" +
              y +
              "' data-id='" +
              tempLoc.id +
              "'><img src='" +
              CTX.framePath +
              tempLoc.icon +
              "'></div>"; // Помещение этих локаций в карусель
          }
        }
      }
    }
    $('body .mapplic-colored').attr('style', 'fill:#ff000f');
    $('body .owl-carousel')
      .trigger('replace.owl.carousel', shops)
      .trigger('refresh.owl.carousel');
    CTX.initCatImgFiltration();
  }
  
  clearModule() {
    // Функция очистки всего модуля карты для подальшей смены языка и реинициализации
    
    window.history.pushState('', 'Map modlue', '/');
    this.map.removeData('mapplic'); // Удаление данных мапплика
    this.map.empty(); // Очистка переменной карты
  }
  
  DOMLoaded(CTX = this) {
    window.addEventListener('DOMContentLoaded', () => {
      console.log('DOM LOADED SCANNER');
      window.iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
      window.isMediaStreamAPISupported = navigator && navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices;
      window.noCameraPermission = true;
      
      var copiedText = null;
      var frame = null;
      var selectPhotoBtn = document.querySelector('.app__select-photos');
      var dialogElement = document.querySelector('.app__dialog');
      var dialogOverlayElement = document.querySelector('.app__dialog-overlay');
      var dialogOpenBtnElement = document.querySelector('.app__dialog-open');
      var dialogCloseBtnElement = document.querySelector('.app__dialog-close');
      var scanningEle = document.querySelector('.custom-scanner');
      var textBoxEle = document.querySelector('#result');
      var helpTextEle = document.querySelector('.app__help-text');
      var infoSvg = document.querySelector('.app__header-icon svg');
      var videoElement = document.querySelector('video');
      window.appOverlay = document.querySelector('.app__overlay');
      
      //Initializing qr scanner
      window.addEventListener('load', event => {
        QRReader.init(); //To initialize QR Scanner
        // Set camera overlay size
        setTimeout(() => {
          setCameraOverlay();
          if (window.isMediaStreamAPISupported) {
            scan();
          }
        }, 1000);
        
        // To support other browsers who dont have mediaStreamAPI
        selectFromPhoto();
      });
      
      $(document).on('click', '#restart-scanner', function () {
        // Set camera overlay size
        setTimeout(() => {
          setCameraOverlay();
          if (window.isMediaStreamAPISupported) {
            scan();
          }
        }, 1000);
      });
      
      function setCameraOverlay() {
        window.appOverlay.style.borderStyle = 'solid';
      }
      
      function createFrame() {
        frame = document.createElement('img');
        frame.src = '';
        frame.id = 'frame';
      }
      
      //Dialog close btn event
      dialogCloseBtnElement.addEventListener('click', hideDialog, false);
      dialogOpenBtnElement.addEventListener('click', openInBrowser, false);
      
      //To open result in browser
      function openInBrowser() {
        console.log('Result: ', copiedText);
        window.open(copiedText, '_blank', 'toolbar=0,location=0,menubar=0');
        copiedText = null;
        hideDialog();
      }
      
      function closeVideoStream() {
        navigator.mediaDevices.getUserMedia({audio: false, video: true},
          function (stream) {
            var mediaStream = stream;
            stream.getTracks().forEach(track => track.stop())
          }
        );
      }
      
      //Scan
      function scan(forSelectedPhotos = false) {
        if (window.isMediaStreamAPISupported && !window.noCameraPermission) {
          scanningEle.style.display = 'block';
        }
        
        if (forSelectedPhotos) {
          scanningEle.style.display = 'block';
        }
        
        QRReader.scan(result => {
          copiedText = result;
          textBoxEle.value = result;
          textBoxEle.select();
          scanningEle.style.display = 'none';
          playAudio();
          if (isURL(result)) {
            setTimeout(function () {
              var url = new URL(copiedText);
              var terminal = url.searchParams.get(constants.SCAN_PARAM_TERMINAL);
              var mall = url.searchParams.get(constants.SCAN_PARAM_MALL);
              var marker = url.searchParams.get(constants.SCAN_PARAM_MARKER); // start and common
              $(CTX.screenScanner).attr('scan', true);
              $(CTX.screenScanner).attr(constants.SCAN_PARAM_TERMINAL, terminal);
              $(CTX.screenScanner).attr(constants.SCAN_PARAM_MALL, mall);
              $(CTX.screenScanner).attr(constants.SCAN_PARAM_MARKER, marker);
              $(document).find('.open-choose-right-menu').trigger('click');
              
              setTimeout(closeVideoStream, 1000); // close video
              
            }.bind(this), 300)
            // dialogOpenBtnElement.style.display = 'inline-block';
          }
          
          // dialogElement.classList.remove('app__dialog--hide');
          // dialogOverlayElement.classList.remove('app__dialog--hide');
          // const frame = document.querySelector('#frame');
          // if (forSelectedPhotos && frame) frame.remove();
        }, forSelectedPhotos);
        
      }
      
      function playAudio() {
        const isIos = () => {
          const userAgent = window.navigator.userAgent.toLowerCase();
          return /iphone|ipad|ipod/.test(userAgent);
        };
        
        var urlProd = './images/soundScanner.wav';
        var audio = new Audio(urlProd);
        
        if (isIos()) {
          var myAudioContext = new (window.AudioContext || window.webkitAudioContext)();
          var source = myAudioContext.createBufferSource();
          
          var request = new XMLHttpRequest();
          request.open('GET', './images/soundScanner.wav', true);
          request.responseType = 'arraybuffer';
          request.addEventListener('load', bufferSound, false);
          request.send();
          
          function bufferSound(event) {
            var request = event.target;
            var audioData = request.response;
            
            myAudioContext.decodeAudioData(audioData, function (buffer) {
              source.buffer = buffer;
              
              source.connect(myAudioContext.destination);
              source.start(0);
            });
          }
        } else {
          audio.play();
        }
        
      }
      
      //Hide dialog
      function hideDialog() {
        copiedText = null;
        textBoxEle.value = '';
        
        if (!window.isMediaStreamAPISupported) {
          frame.src = '';
          frame.className = '';
        }
        
        dialogElement.classList.add('app__dialog--hide');
        dialogOverlayElement.classList.add('app__dialog--hide');
        scan();
      }
      
      function selectFromPhoto() {
        //Creating the camera element
        var camera = document.createElement('input');
        camera.setAttribute('type', 'file');
        camera.setAttribute('capture', 'camera');
        camera.id = 'camera';
        window.appOverlay.style.borderStyle = '';
        if (selectPhotoBtn) {
          selectPhotoBtn.style.display = 'block';
        }
        createFrame();
        
        //Add the camera and img element to DOM
        var pageContentElement = document.querySelector('.app__layout-content');
        pageContentElement.appendChild(camera);
        pageContentElement.appendChild(frame);
        
        if (selectPhotoBtn) {
          //Click of camera fab icon
          selectPhotoBtn.addEventListener('click', () => {
            scanningEle.style.display = 'none';
            document.querySelector('#camera').click();
          });
        }
        
        //On camera change
        camera.addEventListener('change', event => {
          if (event.target && event.target.files.length > 0) {
            frame.className = 'app__overlay';
            frame.src = URL.createObjectURL(event.target.files[0]);
            if (!window.noCameraPermission) scanningEle.style.display = 'block';
            window.appOverlay.style.borderColor = 'rgb(62, 78, 184)';
            scan(true);
          }
        });
      }
    })
  }
}

function PathFinder(linesArray) {
  'use strict';
  
  // console.log('222 2 PathFinder, linesArray', linesArray);
  
  var that = this;
  this.lines = linesArray;
  this.graph = new graphService.Graph();
  // console.log('===this.lines>>>', this.lines);
  this.lines.forEach(function (line) {
    that.lines.forEach(function (searchedLine) {
      if (
        ((line.x1 === searchedLine.x1 && line.y1 === searchedLine.y1) ||
          (line.x2 === searchedLine.x2 && line.y2 === searchedLine.y2) ||
          (line.x1 === searchedLine.x2 && line.y1 === searchedLine.y2)) &&
        line.shopId !== searchedLine.shopId
      ) {
        // console.log(searchedLine);
        that.graph.addEdge(line.shopId, searchedLine.shopId);
      }
    });
  });
  
  this.shopsToLines = function (ids) {
    // console.log('===that>>> ids', ids);
    return ids.map(function (shopId) {
      // console.log('===3201===that.lines', that.lines);
      var index = that.lines.findIndex(function (line) {
        return line.shopId == shopId;
      });
      
      if (index !== -1) {
        // console.log('===that>>> return', that.lines[index]);
        return that.lines[index];
      } else {
        throw Error('No line with matched shopId');
      }
    });
  };
}

PathFinder.prototype.findPath = function (terminalId, shopId) {
  // console.log('findPath => lines', terminalId, shopId, this.lines)
  var start = null;
  
  this.lines.forEach(function (line, index) {
    // console.log('_find_a', terminalId, line.shopId);
    if (!!terminalId.includes(line.shopId)) {
      // console.log('findPath => dot a yyyeeesss');
      // TODO 1
      start = line.shopId;
    }
  });
  var end = null;
  this.lines.forEach(function (line, index) {
    // console.log('_find_b', shopId, line.shopId);
    if (line.shopId === shopId) {
      // console.log('findPath => dot b yyyeeesss');
      end = line.shopId;
    }
  });
  // console.log('_find_1 => bfs', 'this.graph', this.graph, 'shopId', shopId);
  // console.log('_find_5 => bfs', 'this.graph', graphService.shortestPath(this.graph, start, end), start, end);
  graphService.bfs(this.graph, start);
  return this.shopsToLines(graphService.shortestPath(this.graph, start, end));
}

const snackbar = MapConstructor.snackbar;
export { snackbar }

export default MapConstructor;
