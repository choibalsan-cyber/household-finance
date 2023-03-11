var uiController = (function () {})();

var fnController = (function () {})();

var appController = (function (uiCtrl, fnCtrl) {
  //
  var ctrlAddItem = function () {
    // 1. Дэлгэцнээс утгуудыг авна
    // 2. Санхүүгийн контроллерт дамжуулж тэнд хадгална
    // 3. Дэлгэцэнд тохирох хэсэгт гаргана
    // 4. Төсвийг тооцоолно
    // 5. Эцсийн үлдэгдлийг дэлгэцэнд үзүүлнэ
  };
  // Зөв тэмдэгтийн эвент листенер
  document.querySelector('.add__btn').addEventListener('click', function () {
    ctrlAddItem();
  });
  document.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter') {
      ctrlAddItem();
    }
  });
})(uiController, fnController);
