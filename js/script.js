/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/

document.addEventListener('DOMContentLoaded', () => {
  const pageElement = document.querySelector('.page');
  const studentUl = document.querySelector('.student-list');
  let studentList;
  let messageDiv;
  
  /**
   * Creates a DOM searchBarent, sets its attributes, and returns it.
   * @param {string} type - the tag name of the searchBarent to be created
   * @param {array} properties - [optional]. An array of objects to set properties on the searchBarent. Uses name to identify the property and value to set the property.
   */
  const createElement = (type, properties = []) => {
    let element = document.createElement(type);
    if(properties.length) {
      properties.forEach(property => {
        element[property.name] = property.value;
      });
    }
    return element;
  }

  /**
   * Appends one or more children searchBarents to the parent searchBarent. Appends in the order in which they are stored in the children array.
   * @param {html} parent - The searchBarent to which the children should be appended.
   * @param {array} children - An array of HTML element. These are appended to the parent.
   */
  const appendTo = (parent, children = []) => {
    if(children.length) {
      children.forEach(child => {
        parent.appendChild(child);
      });
    }
    return parent;
  }

  /**************************************
  * SEARCH COMPONENT
  **************************************/
  /**
   * Creates the searchbar searchBarent. Adds event listener to the searchBarent.
   */
  const createSearchBar = () => {
    const searchDiv = createElement('div', [{name: 'className', value: 'student-search'}]);
    const searchInput = createElement('input', [{name: 'placeholder', value: 'Search for students...'}]);
    searchInput.addEventListener('keyup', () => handleSearchAction(searchInput.value.toLowerCase()));
    // const searchButton = createElement('button', [{name: 'textContent', value: 'Search'}]);
    appendTo(searchDiv, [searchInput/* , searchButton */]);
    return searchDiv;
  }

  /**
   * Performs a number of actions when the user enters a value in the search bar.
   * Filters the student list to only include items matching the searchTerm.
   * Cleans up page cards.
   * Clears system messages
   * Displays new page cards based on the filtered students.
   * Displays the filtered students.
   * Sets the active page.
   * @param {string} searchTerm - The user-entered search term, used to filter the student records.
   */
  const handleSearchAction = (searchTerm) => {
    studentList = filterStudentBySearch(searchTerm);
    cleanUpOldPageCards();
    clearSystemMessage();
    displayPageCards(createPageCards(studentList));
    filterStudentsByPage(setActivePage(pageElement.lastElementChild.firstElementChild.firstElementChild), studentList);
    if(studentList.length) {
      setActivePage(pageElement.querySelector('.pagination ul').firstElementChild.firstElementChild);
    }
  }

  /**
   * Appends the search bar to its parent container, the header element.
   * @param {html} searchBar - The search bar searchBarent.
   */
  const loadSearchBar = (searchBar) => {
    const header = document.querySelector('.page-header');
    appendTo(header, [searchBar]);
  }

  /**
   * Checks the list of students to determine which to display.
   * Returns a list of students that match the entered search value.
   * @param {string} value - The user-entered search value, formatted to ensure lower case.
   */
  const filterStudentBySearch = (value) => {
    const students = getAllStudents();
    const filteredStudents = [];
    for(let student = 0; student < students.length; student++) {
      const studentName = students[student].querySelector('h3').textContent.toLowerCase();
      const studentEmail = students[student].querySelector('.email').textContent.toLowerCase();
      if(studentName.includes(value) || studentEmail.includes(value)) {
        filteredStudents.push(students[student]);
        displayStudent(students[student]);
      } else {
        hideStudent(students[student]);
      }
    }
    return filteredStudents;
  }

  /**************************************
  * PAGE NUMBER COMPONENT
  **************************************/
  /**
   * Returns the page buttons for each group of ten students. Also creates a card for groups that contain less than ten students (the leftovers).
   * @param {HTMLCollection} students - An HTML collection containing all students .
   */
  const createPageCards = (students) => {
    const pageCount = Math.ceil(students.length / 10);
    const pageCards = [];
    const div = createElement('div', [{name: 'className', value: 'pagination'}]);
    const ul = createElement('ul');
    for( let page = 1; page <= pageCount; page++) {
      const li = createElement('li');
      const a = createElement('a', [{name: 'href', value: '#'}, {name: 'textContent', value: page}]);
      appendTo(li, [a]);
      pageCards.push(li);
    }
    appendTo(ul, [...pageCards])
    appendTo(div, [ul]);
    return div;
  }

  /**
   * Removes the old page cards so that the DOM doesn't get duplicates.
   */
  const cleanUpOldPageCards = () => {
    const pageCards = pageElement.querySelector('.pagination');
    pageElement.removeChild(pageCards);
  }

  /**
   * Appends the page cards to the DOM and initializes event listeners.
   * @param {html} container - The HTML container holding the page cards.
   */
  const displayPageCards = (container) => {
    container.addEventListener('click', (e) => handlePageButtonClick(e));
    appendTo(studentUl.parentNode, [container]);
  }

  /**
   * Performs a number of actions when the user clicks on a page card.
   * Prevents default submission activity.
   * Sets the active page to the clicked page.
   * Filters students based on active page.
   * @param {event} e - The triggering event.
   */
  const handlePageButtonClick = (e) => {
    e.preventDefault();
    if(e.target.tagName == 'A') {
      let activePage = setActivePage(e.target);
      filterStudentsByPage(activePage, studentList);
    }
  }
  
  /**
   * Sets the clicked pageButton to active. Inactives all other pageButtons.
   * @param {html} page - The HTML element to be set as active.
   */
  const setActivePage = (page = '') => {
    const pageLinks = pageElement.querySelectorAll('.pagination ul li a');
    if(page) {
      pageLinks.forEach(link => link.className = '');
      page.className = 'active';
      return page.textContent;
    }
  }

  /**
   * Displays students belonging to the passed page. 
   * Students belong to the page if their index falls within the min and max values.
   * @param {number} page - The page number to be used to set min and max of the student page filter.
   */
  const filterStudentsByPage = (page, students) => {
    if(students.length) {
      const { min, max } = setPageRange(page, students.length);
      for(let allStudent = 0; allStudent < students.length; allStudent++) {
        hideStudent(students[allStudent]);
      }
      for(let activeStudent = min; activeStudent < max; activeStudent++) {
        displayStudent(students[activeStudent]);
      }
    } else {
      displaySystemMessage(displayNoResult());
    }
  }

  /**
   * Sets the min and max values to be used when determining which students to display in the DOM.
   * @param {html} page - The currently selected page button.
   * @param {number} totalStudents - The number of student records available for display.
   */
  const setPageRange = (page, totalStudents ) => {
    const min = (page - 1) * 10;
    let max;
    min + 10 > totalStudents
      ? max = totalStudents
      : max = min + 10;
    return { min, max };
  }

  /**************************************
  * DISPLAY RESULTS COMPONENT
  **************************************/
  /**
   * Returns an HTML collection containing all the students in the DOM.
   */
  const getAllStudents = () => {
    studentList = studentUl.children;
    return studentList;
  }

  /**
   * Sets the passed student to hide.
   * @param {html} student - One student element.
   */
  const hideStudent = (student) => {
    return student.className = 'student-item cf hide';
  }

  /**
   * Sets the passed student to show.
   * @param {html} student - One student element.
   */
  const displayStudent = student => {
    return student.className = 'student-item cf';
  }

  /**
   * Creates a div in the DOM for displaying messages to the user.
   */
  const createMessageDiv = () => {
    const div = createElement('div', [{ name: 'id', value: 'messages'}]);
    pageElement.insertBefore(div, studentUl);
    messageDiv = div;
  }

  /**
   * Displays a message in the DOM.
   */
  const displaySystemMessage = (message) => messageDiv.innerHTML = `<p>${message}</p>`;
  
  /**
   * Clears system messages from the DOM.
   */
  const clearSystemMessage = () => messageDiv.innerHTML = '';

  /**
   * A specific type of system message resulting when the database or the search criteria return no student records.
   */
  const displayNoResult = () => 'No results found.';

  /**************************************
  * ON LOAD PROTOCOLS
  **************************************/
  loadSearchBar(createSearchBar());
  displayPageCards(createPageCards(getAllStudents()));
  createMessageDiv();

  if(studentUl.children.length) {
    const pageCardDiv = pageElement.lastElementChild;
    const firstCard = pageCardDiv.firstElementChild.firstElementChild;
    filterStudentsByPage(setActivePage(firstCard), getAllStudents());
    setActivePage(firstCard.firstElementChild);
  } else {
    displaySystemMessage(displayNoResult());
  }
});
