document.addEventListener('DOMContentLoaded', function(){
  let inputName = document.querySelector('.name__student'); // ввод имени
  let inputSurame = document.querySelector('.surname__student'); // ввод фамилии
  let inputPatronymic = document.querySelector('.patronymic__student'); // ввод отчества
  let inputDate = document.querySelector('.birth-date__student'); // дата рождения
  let inputYear = document.querySelector('.year__student'); // год начала обучения
  let inputFaculty = document.querySelector('.faculty__student'); // факультет
  let inputFilter = document.querySelectorAll('.filters__input'); // инпуты для фильтрации
  let now = new Date(); // переменная для текущей даты

  let studentList = document.querySelector('.students__list');
  let btnAddStudent = document.querySelector('.btn__save');
  let studentsArray = []; // массив для студентов
  let filterArray = []; // массив для фильтрации
  let availability = false;

  let btnsSort = document.querySelectorAll('.custom-btn');

  // ----------------------------------------\/ ДОБАВЛЕНИЕ ДАННЫХ О СТУДЕНТЕ
  // функция добавления данных о студенте
  function addData(array){
    // заполнение БД
    if (array.length > 1) { // проверяем на наличие данных. Если длинна больше 1, значит есть данные (берем последний элемент в массиве)
      let line = document.createElement('tr'); // создается строка со студентом
      line.classList.add('students__list-item');
      element = array[array.length - 1];
      availability = true;

      for(let key in element) {
        col = document.createElement('td');
        col.classList.add('p-1');
        col.textContent = (element[key]);

        line.append(col);
        studentList.append(line);
      };
    }
    else {
      let line = document.createElement('tr'); // создается строка со студентом
      line.classList.add('students__list-item');
      element = array[0];
      availability = true;

      for(let key in element) {
        col = document.createElement('td');
        col.classList.add('p-1');
        col.textContent = (element[key]);

        line.append(col);
        studentList.append(line);
      };
    };
  };

  // функция добавления отсортированных данных о студенте
  function addDataSort(array, btn){
    if (availability === true) {
      let studentListItem = document.querySelectorAll('.students__list-item');

      for(let item of studentListItem) {
        item.remove();
      }

      array.forEach((element) => {
        let line = document.createElement('tr'); // создается строка со студентом
        line.classList.add('students__list-item');
        btn.classList.add('sort');

        for(let key in element) {
          col = document.createElement('td');
          col.classList.add('p-1');
          col.textContent = (element[key]);

          line.append(col);
          studentList.append(line);
        };
      });
    }
  }

  // Функция добавления отфильтрованных данных о студенте
  function addDataFilter(array){
    deleteData();

    array.forEach((element) => {
      let line = document.createElement('tr'); // создается строка со студентом
      line.classList.add('students__list-item');

      for(let key in element) {
        col = document.createElement('td');
        col.classList.add('p-1');
        col.textContent = (element[key]);

        line.append(col);
        studentList.append(line);
      };
    });

  }

  // Проверяем наличие данных в LocalStorage (чтобы после перезагрузки данные не удалялись)
  let local = localStorage.getItem('storageList');

  if (local) {
    studentsArray = JSON.parse(local);

    for(let i = 0; i < studentsArray.length; i++){
      let localArray = [];
      localArray.push(studentsArray[i]);
      addData(localArray);
    }
  }

  // Функция отчистки данных
  function deleteData(){
    let studentListItem = document.querySelectorAll('.students__list-item');

    for(let item of studentListItem) {
      item.remove();
    }
  }

  // ----------------------------------------\/ ПРОВЕРКА И ОТЧИСТКА ПОЛЕЙ ПОСЛЕ ЗАПОЛНЕНИЯ

  // функция проверки полей на наличие данных и правильность ввода (валидация)
  function correctData() {
    let error = document.querySelector('.form__errors');
    let inputError = document.querySelector('.input__error');

    // проверка всех полей на наличие данных
    if ((inputName.value !== '') & (inputSurame.value !== '') & (inputPatronymic.value !== '') & (inputDate.value !== '') & (inputYear.value !== '') & (inputFaculty.value !== '')){

      let yearOfInputDate = Number(inputDate.value.substring(0, 4));
      error.classList.remove('visible-error');

      // проверка поля даты рождения
      if ((inputDate.value > '1900-01-01') && (yearOfInputDate < now.getFullYear())){
        inputDate.classList.remove('error');
        inputError.classList.remove('visible-error');
      }
      else {
        inputDate.classList.add('error');
        inputError.classList.add('visible-error');
        inputDate.value = '';
      }

      // проверка поля начала года рождения
      if ((2000 <= inputYear.value) && (inputYear.value < now.getFullYear())){
        inputYear.classList.remove('error');
        inputError.classList.remove('visible-error');
        return true;
      }
      else {
        inputYear.classList.add('error');
        inputError.classList.add('visible-error');
        inputYear.value = '';
        return false;
      }
    }
    else {
      inputError.classList.remove('visible-error');
      error.classList.add('visible-error');
      return false;
    }
  }

  // функция отчистки полей
  function clear() {
    let allInput = document.querySelectorAll('.input');

    for (let i=0; i <allInput.length; i++) {
      allInput[i].value = '';
      allInput[i].classList.remove('error');
    }
  }

  // ----------------------------------------\/ РАСЧЕТ ДАННЫХ

  // функция для расчета возраста студента
  function getCurrentAge (date) {
    date = date.split('-'); // убираем дефис и преобразуем в массив

    let nowYear = now.getFullYear(); // получаем текущий год
    let studentYear = Number(date[0]); // получаем год рождения студента
    let studentMonth = Number(date[1]); // получаем месяц рождения студента
    let studentDay = Number(date[2]); // получаем день рождения студента

    let age = nowYear - studentYear; // Возраст

    // проверяем, когда было День рождение
    if (studentMonth > (now.getMonth()+1)) { // если месяц больше чем текущий, значит ДР еще не было (уменьшаем age)
      age-=1;
      return age;
    }
    else if (studentMonth < (now.getMonth()+1)) { // если месяц меньше чем текущий, значит ДР прошло (просто возвращаем age без изменений)
      return age;
    }
    else if (studentMonth === (now.getMonth()+1)) { // если месяц равен текущему, значит ДР будет в этом месяце
      if ((studentDay === now.getDate())||(studentDay < now.getDate())){ // узнаем день рождения студента (чтобы узнать сегодн ли ДР или уже прошел).
        return age;                                                       //Если, да, то просто возвращаем age без изменений
      }
      else {                                                               // иначе уменьшаем age
        age-=1;
        return age;
      }
    }
  }

  // функция для расчета курса
  function getCurrentCourse(year){
    year = now.getFullYear() - Number(year); // высчитываем, какой курс

    if (year > 4) {
      year = 'Закончил';
      return year;
    }
    else if (year === 4) {
      if (now.getMonth() > 8) {
        year = 'Закончил';
        return year;
      }
      else return `${year} курс`;
    }
    else return `${year} курс`;
  }

  // ----------------------------------------\/ СОРТИРОВКА

  // функция сортировки данных по алфавиту
  function sortAlphabetically(array, marker){
    if (marker === 'name') {
      array.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      });

      let fullNameBtb = document.querySelector('.student__full-name');

      addDataSort(array, fullNameBtb);
    }
    else if (marker === 'faculty') {
      array.sort(function (a, b) {
        if (a.faculty > b.faculty) {
          return 1;
        }
        if (a.faculty < b.faculty) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      });

      let facultyBtb = document.querySelector('.student__faculty');

      addDataSort(array, facultyBtb);
    }
    else if (marker === 'date') {
      array.sort(function (a, b) {
        if (a.date < b.date) {
          return 1;
        }
        if (a.date > b.date) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      });

      let dateBtb = document.querySelector('.student__date');

      addDataSort(array, dateBtb);
    }
    else if (marker === 'year') {
      array.sort(function (a, b) {
        if (a.year < b.year) {
          return 1;
        }
        if (a.year > b.year) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      });

      let yearBtb = document.querySelector('.student__year');

      addDataSort(array, yearBtb);
    }
  }

  // функция "Фильтр"
  function filteredData (el){
    if (el.target.value.length === 0) {
      deleteData();
      filterArray = [];

      studentsArray.forEach(student =>{
        let array = [];
        array.push(student)
        addData(array);
      })
    }
    else {
      if (el.target.classList.contains('filters__input_full-name')){
        let filterValue = el.target.value.toUpperCase().split(' ').join('');

        if (filterArray.length === 0) {
          for (let i = 0; i < studentsArray.length; i++) {
            if (studentsArray[i].name.toUpperCase().split(' ').join('').includes(filterValue)){
              filterArray.push(studentsArray[i]);
            }
          }
          addDataFilter(filterArray);
        }
        else {
          for (let i = 0; i < filterArray.length; i++) {
            if (!filterArray[i].name.toUpperCase().split(' ').join('').includes(filterValue)){
              filterArray.splice(i, 1);
            }
          }
          addDataFilter(filterArray);
        }
      }
      else if (el.target.classList.contains('filters__input_faculty')){
        let filterValue = el.target.value.toUpperCase().split(' ').join('');

        if (filterArray.length === 0) {
          for (let i = 0; i < studentsArray.length; i++) {
            if (studentsArray[i].faculty.toUpperCase().split(' ').join('').includes(filterValue)){
              filterArray.push(studentsArray[i]);
            }
          }
          addDataFilter(filterArray);
        }
        else {
          for (let i = 0; i < filterArray.length; i++) {
            if (!filterArray[i].faculty.toUpperCase().split(' ').join('').includes(filterValue)){
              filterArray.splice(i, 1);
            }
          }
          addDataFilter(filterArray);
        }
      }
      else if (el.target.classList.contains('filters__input_start-year')){
        let filterValue = el.target.value.split(' ').join('');

        if (filterArray.length === 0) {
          for (let i = 0; i < studentsArray.length; i++) {
            if (studentsArray[i].year.substring(0, 4).split(' ').join('').includes(filterValue)){
              filterArray.push(studentsArray[i]);
            }
          }
          addDataFilter(filterArray);
        }
        else {
          let filteredArrayByStartYear = [];

          for (let i = 0; i < filterArray.length; i++) {
            if (filterArray[i].year.substring(0, 4).split(' ').join('').includes(filterValue)){
              filteredArrayByStartYear.push(filterArray[i]);
            }
          }
          addDataFilter(filteredArrayByStartYear);
          filterArray = filteredArrayByStartYear;
        }
      }
      else if (el.target.classList.contains('filters__input_end-year')){
        let filterValue = el.target.value.split(' ').join('');

        if (filterArray.length === 0) {
          for (let i = 0; i < studentsArray.length; i++) {
            if (studentsArray[i].year.substring(5,9).split(' ').join('').includes(filterValue)){
              filterArray.push(studentsArray[i]);
            }
          }
          addDataFilter(filterArray);
        }
        else {
          let filteredArrayByEndYear = [];

          for (let i = 0; i < filterArray.length; i++) {
            if (filterArray[i].year.substring(5, 9).split(' ').join('').includes(filterValue)){
              filteredArrayByEndYear.push(filterArray[i]);
            }
          }
          addDataFilter(filteredArrayByEndYear);
          filterArray = filteredArrayByEndYear;
        }
      }
    };
  };

  // ----------------------------------------\/ КНОПКИ

  // кнопки для сортировки
  btnsSort.forEach((btn)=>{
    btn.addEventListener('click', (e) =>{
      if(availability === true) {
        btnsSort.forEach(el =>{
          el.classList.remove('sort')
        });

        let marker = '';
        btn.classList.add('sort');

        if(btn.classList.contains('student__full-name')){
          marker = 'name';
          sortAlphabetically(studentsArray, marker);
        }
        else if (btn.classList.contains('student__faculty')){
          marker = 'faculty';
          sortAlphabetically(studentsArray, marker);
        }
        else if (btn.classList.contains('student__date')){
          marker = 'date';
          sortAlphabetically(studentsArray, marker);
        }
        else if (btn.classList.contains('student__year')){
          marker = 'year';
          sortAlphabetically(studentsArray, marker);
        }
      };
    });
  })

  // кнопка "Добавить студента"
  btnAddStudent.addEventListener('click', () => {
    if (correctData()) { // если проходит проверку на валидность данных заполняем БД
      let student = {
        name: `${inputSurame.value.trim()} ${inputName.value.trim()} ${inputPatronymic.value.trim()}`,
        date: `${inputDate.value} (${getCurrentAge(inputDate.value)} лет)`,
        year: `${inputYear.value}-${Number(inputYear.value)+4} (${getCurrentCourse(inputYear.value)})`,
        faculty: inputFaculty.value,
      };

      studentsArray.push(student); // добавляем нового студента в массив
      localStorage.setItem('storageList', JSON.stringify(studentsArray));

      addData(studentsArray); // вызываем функцию заполнения
      clear(); // очищаем поля от данных

      btnsSort.forEach(el =>{
        el.classList.remove('sort')
      });
    };
  });

  // инпуты для фильтрации
  inputFilter.forEach((input) => {
    input.addEventListener('input', filteredData);
  });
});
