var uiController = (function () {
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    addButton: '.add__btn',
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },
    getDomStrings: function () {
      return DOMStrings;
    },
  };
})();

var fnController = (function () {
  var Income = function (id, desc, val) {
    this.id = id;
    this.desc = desc;
    this.val = val;
  };

  var Expense = function (id, desc, val) {
    this.id = id;
    this.desc = desc;
    this.val = val;
  };

  var data = {
    items: {
      inc: [],
      exp: [],
    },
    total: {
      inc: 0,
      exp: 0,
    },
  };

  return {
    saveItems: function (type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) id = 1;
      else id = data.items[type][data.items[type].length - 1].id + 1;

      if (type === 'inc') {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }
      data.items[type].push(item);
    },
    seeData: function () {
      return data;
    },
  };
})();

var appController = (function (uiCtrl, fnCtrl) {
  var ctrlAddItem = function () {
    // 1. Дэлгэцнээс утгуудыг авна
    var input = uiCtrl.getInput();

    // 2. Санхүүгийн контроллерт дамжуулж тэнд хадгална
    fnController.saveItems(input.type, input.description, input.value);
    // 3. Дэлгэцэнд тохирох хэсэгт гаргана
    // 4. Төсвийг тооцоолно
    // 5. Эцсийн үлдэгдлийг дэлгэцэнд үзүүлнэ
  };

  var setupEventListeners = function () {
    // Дэлгэцийн DOM
    var DOM = uiCtrl.getDomStrings();

    // Зөв тэмдэгтийн эвент листенер
    document
      .querySelector(DOM.addButton)
      .addEventListener('click', function () {
        ctrlAddItem();
      });
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter') {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function () {
      console.log('Started');
      setupEventListeners();
    },
  };
})(uiController, fnController);

appController.init();
