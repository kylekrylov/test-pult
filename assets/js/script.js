"use strict";
//

$(document).ready(function () {
   $(".portfolio__cards").slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToScroll: 1,
      variableWidth: true,
      responsive: [
         {
            breakpoint: 600,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 1,
               arrows: false,
            },
         },
         {
            breakpoint: 320,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
      ],
   });
});
