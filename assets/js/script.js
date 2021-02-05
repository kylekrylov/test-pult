"use strict"
// 
;

$(document).ready(function () {
   $('.portfolio__cards').slick({
      dots: true,
      infinite: true,
      speed: 300,
      // slidesToShow: 4,
      slidesToScroll: 1,
      // centerMode: true,
      variableWidth: true,
      responsive: [
         {
           breakpoint: 600,
           settings: {
             slidesToShow: 2,
             slidesToScroll: 1,
             infinite: true
           }
         },
         {
            breakpoint: 320,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true
            }
          }
      ]
   });
});
