$(function () {

  $('.dropdown-keep-open .dropdown-menu').on('click', function (e) {
    e.stopPropagation();
  });

  $('.dropdown-detached').on('show.bs.dropdown', function() {
    var $this = $(this);
    var $dropdownMenu = $this.find('.dropdown-menu');

    var offset = $this.offset();

    var css = {
      position: 'absolute',
      left: offset.left,
      top: offset.top
    };

    $('body').append($dropdownMenu.css(css).detach());
  });

});
