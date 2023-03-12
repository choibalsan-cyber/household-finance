var uiController = (function () {
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    addButton: '.add__btn',
    incomeList: '.income__list',
    expenseList: '.expenses__list',
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },
    addListItem: function (item, type) {
      // Орлого зарлагад зориулсан HTML бэлтгэнэ
      var html, listDom;
      if (type === 'inc') {
        html =
          '<div class="item clearfix" id="inc-%%1%%"><div class="item__description">%%desc%%</div><div class="right clearfix"><div class="item__value">+ %%val%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
        listDom = DOMStrings.incomeList;
      } else {
        html =
          '<div class="item clearfix" id="exp-%%1%%"><div class="item__description">%%desc%%</div><div class="right clearfix"><div class="item__value">- %%val%%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        listDom = DOMStrings.expenseList;
      }
      html = html.replace('%%1%%', item.id);
      html = html.replace('%%desc%%', item.desc);
      html = html.replace('%%val%%', item.val);

      // Tохирох хэсэгт гаргана
      document.querySelector(listDom).insertAdjacentHTML('beforeend', html);
    },

    clearField: function () {
      // Node elements
      var fields = document.querySelectorAll(
        DOMStrings.inputDescription + ', ' + DOMStrings.inputValue
      );

      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach((el) => (el.value = ''));
      fieldsArr[0].focus();
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
    this.val = parseInt(val);
  };

  var Expense = function (id, desc, val) {
    this.id = id;
    this.desc = desc;
    this.val = parseInt(val);
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
    budget: 0,
    percentage: 0,
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach((el) => (sum += el.val));
    data.total[type] = sum;
    console.log(sum);
  };

  return {
    calculateBudget: function () {
      // Нийт орлогуудыг тооцоолно
      calculateTotal('inc');

      // Нийт зарлагуудыг тооцоолно
      calculateTotal('exp');

      // Төсвтийг шинээр тооцоолно
      data.budget = data.total.inc - data.total.exp;

      // Нийт зарлагын эзлэх хувийг олно
      data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
    },

    getBudget: function () {
      return {
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        budget: data.budget,
        percentage: data.percentage,
      };
    },

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
      return item;
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

    if (input.description !== '' && input.value !== '') {
      // 2. Санхүүгийн контроллерт дамжуулж тэнд хадгална
      var item = fnController.saveItems(
        input.type,
        input.description,
        input.value
      );

      // 3. Дэлгэцэнд тохирох хэсэгт гаргана
      uiController.addListItem(item, input.type);
      uiController.clearField();

      // 4. Төсвийг тооцоолно
      fnController.calculateBudget();

      // 5. Эцсийн үлдэгдлийг тооцоолно
      var budget = fnController.getBudget();

      // 6. Дэлгэцэнд үзүүлнэ
      console.log(budget);
    }
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
