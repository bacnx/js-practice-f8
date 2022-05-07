const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$('.tab-item');
const panes = $$('.tab-pane');
const line = $('.line');
var activeTab = $('.tab-item.active');

line.style.left = activeTab.offsetLeft + 'px';
line.style.width = activeTab.offsetWidth + 'px';

console.log([line])

let currentActiveIndex = 0;

tabs.forEach((tab, index) => {
  var pane = panes[index];

  tab.onclick = function() {
    $('.tab-item.active').classList.remove('active');
    $('.tab-pane.active').classList.remove('active');
    
    tab.classList.add('active');
    pane.classList.add('active');

    line.style.left = this.offsetLeft + 'px';
    line.style.width = this.offsetWidth + 'px';
  }
})