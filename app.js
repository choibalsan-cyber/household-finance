var uiController = (function () {
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    addButton: '.add__btn',
    incomeList: '.income__list',
    expenseList: '.expenses__list',
    budgetLabel: '.budget__value',
    totalIncLabel: '.budget__income--value',
    totalExpLabel: '.budget__expenses--value',
    totalPercentageLabel: '.budget__expenses--percentage',
    containerDiv: '.container',
    allPercentages: '.item__percentage',
    date: '.budget__title--month',
  };

  var nodeListForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatMoney = function (number) {
    var x = '' + number;
    var y = x.split('').reverse().join('');
    var count = 1;
    var z = '';
    for (var i = 0; i < y.length; i++) {
      z += y[i];
      if (count % 3 === 0) {
        z += ',';
      }
      count++;
    }
    z = z.split('').reverse().join('');
    if (z[0] === ',') z = z.substr(1, z.length - 1);
    return z;
  };

  return {
    showDate: function () {
      var x = new Date().getMonth() + 1;
      var y = new Date().getDate();
      var z = `${x} сарын ${y}ны өдөр`;
      document.querySelector(DOMStrings.date).textContent = z;
    },

    showPercentages: function (percentages) {
      var nodeEls = document.querySelectorAll(DOMStrings.allPercentages);
      nodeListForeach(nodeEls, function (el, i) {
        el.textContent = percentages[i];
      });
    },

    deleteElement: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    showBudget: function (budget) {
      budget.budget <= 0
        ? (document.querySelector(DOMStrings.budgetLabel).textContent = 0)
        : (document.querySelector(DOMStrings.budgetLabel).textContent =
            '+' + formatMoney(budget.budget));
      budget.totalInc === 0
        ? (document.querySelector(DOMStrings.totalIncLabel).textContent =
            budget.totalInc)
        : (document.querySelector(DOMStrings.totalIncLabel).textContent =
            '+' + formatMoney(budget.totalInc));
      budget.totalExp === 0
        ? (document.querySelector(DOMStrings.totalExpLabel).textContent =
            budget.totalExp)
        : (document.querySelector(DOMStrings.totalExpLabel).textContent =
            '-' + formatMoney(budget.totalExp));
      budget.percentage === 0
        ? (document.querySelector(DOMStrings.totalPercentageLabel).textContent =
            budget.percentage)
        : (document.querySelector(DOMStrings.totalPercentageLabel).textContent =
            budget.percentage + '%');
    },

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
      html = html.replace('%%val%%', formatMoney(item.val));

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
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function (totalInc) {
    if (totalInc === 0) this.percentage = 0;
    else this.percentage = Math.round((this.val / totalInc) * 100);
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
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
    calcPercentages: function () {
      data.items.exp.forEach((el) => el.calcPercentage(data.total.inc));
    },

    getPercentages: function () {
      var allPercentages = data.items.exp.map((el) => el.getPercentage());
      return allPercentages;
    },

    deleteItem: function (type, id) {
      console.log('Deleted');
      var ids = data.items[type].map((el) => el.id);
      var index = ids.indexOf(id);
      if (index !== -1) data.items[type].splice(index, 1);
    },

    calculateBudget: function () {
      // Нийт орлогуудыг тооцоолно
      calculateTotal('inc');

      // Нийт зарлагуудыг тооцоолно
      calculateTotal('exp');

      // Төсвтийг шинээр тооцоолно
      data.budget = data.total.inc - data.total.exp;

      // Нийт зарлагын эзлэх хувийг олно
      if (data.total.inc === 0) {
        data.percentage = 0;
      } else
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
  var updateBudget = function () {
    // 4. Төсвийг тооцоолно
    fnController.calculateBudget();

    // 5. Эцсийн үлдэгдлийг тооцоолно
    var budget = fnController.getBudget();

    // 6. Дэлгэцэнд үзүүлнэ
    uiController.showBudget(budget);

    // 7. Элементүүдийн хувийг тооцоолно
    fnController.calcPercentages();

    // 8. Хувийг хүлээж авна
    var allPercentages = fnController.getPercentages();

    // 9. Эдгээр хувийг дэлгэцэнд гаргана
    uiController.showPercentages(allPercentages);
  };
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
      updateBudget();
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
    document
      .querySelector(DOM.containerDiv)
      .addEventListener('click', function (e) {
        var idType = e.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(idType);
        if (idType) {
          var idNType = idType.split('-');
          var type = idNType[0];

          // Тоон төрөл рүү хөрвүүлэх
          var id = parseInt(idNType[1]);

          // Санхүүгийн модулиас устгах
          fnController.deleteItem(type, id);

          // Дэлгэц дээрээс устгах
          uiController.deleteElement(idType);
          // Тооцоог шинэчлэх
          updateBudget();
        }
      });
  };

  return {
    init: function () {
      console.log('Started');
      uiController.showDate();
      uiController.showBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0,
      });
      setupEventListeners();
    },
  };
})(uiController, fnController);
appController.init();
Array.prototype.splice();
