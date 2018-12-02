/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/

document.addEventListener('DOMContentLoaded', () => {
  const studentUl = document.querySelector('.student-list');
  
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
   * @param {html searchBarent} parent - The searchBarent to which the children should be appended.
   * @param {array} children - An array of HTML searchBarents. These are appended to the parent.
   */
  const appendTo = (parent, children = []) => {
    children.forEach(child => {
      parent.appendChild(child);
    })
    return parent;
  }

   /**************************************
    * SEARCH COMPONENT
   **************************************/
   /** REQUIREMENTS 
    * The Student_System shall allow the user to find the Student_Record by the Search_Criteria.
    * The Search shall {return the Student_Records matching the full Search_Criteria} AND {return the Student_Records matching partial Search_Criteria}.
    * When the user enters a character in the Search_Input, the Student_System shall trigger the Search.
    * When the Search returns more than ten Student_Records, the Student_System shall display no more than ten Student_Records on the Page.
    * When the Search returns more than ten Student_Records, the Student_System shall display the Page_Button for each Page in the Search_Results.
    * When the Search returns no Student_Records, the Student_System shall display the No_Records_Message in the User_Interface. 
   */

  /**
   * Creates the searchbar searchBarent. Adds event listener to the searchBarent.
   */
  const createSearchBar = () => {
    const searchDiv = createElement('div', [{name: 'className', value: 'student-search'}]);
    const searchInput = createElement('input', [{name: 'placeholder', value: 'Search for students...'}]);
    searchInput.addEventListener('keyup', () => {
      filterStudentBySearch(searchInput.value);
    });
    // const searchButton = createElement('button', [{name: 'textContent', value: 'Search'}]);
    appendTo(searchDiv, [searchInput/* , searchButton */]);
    return searchDiv;
  }

  /**
   * Appends the search bar to its parent container, the header element.
   * @param {html searchBarent} searchBar - The search bar searchBarent.
   */
  const loadSearchBar = (searchBar) => {
    const header = document.querySelector('.page-header');
    appendTo(header, [searchBar]);
  }

   /** TODO: filter students by the entered search criteria 
    * filterStudentsBySearch(regex)
      * // filters the student results by regex
      * // displayPageCount(result)
      * // set page 1 to active
      * // set all other pages to inactive
      * // if result.length > 0
      *   // displayStudentResults(result)
      * // else
      *   // displayNoResults()
   */
  const filterStudentBySearch = (value) => {
    console.log('TODO! Filter students by the entered search criteria!');
  }

   /**************************************
    * PAGE NUMBER COMPONENT
   **************************************/
   /** REQUIREMENTS 
    * The Student_System shall display the Page_Button for each Page in the Student_System.
    * The Student_System shall allow the user to select any Page in the Student_System.
    * When the user clicks the Page_Button, the Student_System shall display the Page in the User_Interface.
   */

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
   * Appends the page cards to the DOM and initializes event listeners.
   * @param {HTML element} container - The HTML container holding the page cards.
   */
  const displayPageCards = (container) => {
    container.addEventListener('click', (e) => {
      e.preventDefault()
      let activePage = setActivePage(e.target);
      filterStudentsByPage(activePage);
    });
    appendTo(studentUl.parentNode, [container]);
  }

  /**
   * Sets the clicked pageButton to active. Inactives all other pageButtons.
   * @param {html element} page - The HTML element to be set as active.
   */
  const setActivePage = (page = document.querySelector('.pagination').firstElementChild.firstElementChild.firstElementChild) => {
    const otherCards = page.parentNode.parentNode.children;
    for( let card = 0; card < otherCards.length; card++ ) {
      const cardLink = otherCards[card].firstElementChild;
      cardLink.className = '';
    }
    page.className = 'active';
    return page.textContent;
  }

  /**
   * Displays students belonging to the passed page. 
   * Students belong to the page if their index falls within the min and max values.
   * @param {number} page - The page number to be used to set min and max of the student page filter.
   */
  const filterStudentsByPage = (page)=> {
    let students = getAllStudents();
    const min = (page - 1) * 10;
    let max;
    min + 10 > students.length 
      ? max = students.length
      : max = min + 10;
    
    // cTODO: separate this part out for reusability between methods.
    for(let allStudent = 0; allStudent < students.length; allStudent++) {
      students[allStudent].classList.add('hide');
    }
    for(let activeStudent = min; activeStudent < max; activeStudent++) {
      students[activeStudent].classList.remove('hide');
    }
  }

   /**************************************
    * DISPLAY RESULTS COMPONENT
   **************************************/
   /** REQUIREMENTS 
    * When the user has JavaScript disabled, the Student_System shall display all Student_Records.
    * The Student_System shall display no more than ten Student_Records on the Page.
    * The student_System shall display the current Page.
    * When no Student_Records are available, the Student_System shall display the No_Records_Message.
    * [BONUS] The Student_System shall display the Total_Student_Count in the User_Interface.
   */

  /**
   * Returns an HTML collection containing all the students in the DOM.
   */
  const getAllStudents = () => {
    return studentUl.children;
  }

   /** TODO: update the DOM to only display the students matching the filter 
    * displayStudentResults(students)
      * // sets all searchBarents in the students parameter to `display: block`
      * // sets all others to `display: none`
   */

   /** TODO: update the DOM to display a message if no students are returned from the filter 
    * displayNoResults()
      * // displays the No_Records_Found message
   */

   /** TODO: BONUS! display the total number of students returned from the filter 
    * displayStudentCount()
      * // display the number of students matching the filter
   */

  loadSearchBar(createSearchBar());
  displayPageCards(createPageCards(getAllStudents()));
  filterStudentsByPage(setActivePage());
});
