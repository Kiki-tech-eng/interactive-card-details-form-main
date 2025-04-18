// ==================== ELEMENT SELECTION ==================== //

// Select the main form element using the querySelector method which returns the first element that matches the CSS selector
// We need the form element to add a submit event listener to validate inputs before submission
const form = document.querySelector("form");

// Select all input fields using their unique placeholder attributes as selectors
// querySelector finds the first matching element in the document
// The cardNameInput will store the reference to the input where users type their name
const cardNameInput = document.querySelector(
  'input[placeholder="e.g. Jane Appleseed"]'
);
// This selects the card number input field by its placeholder text
const cardNumberInput = document.querySelector(
  'input[placeholder="e.g. 1234 5678 9123 0000"]'
);
// These select the month and year input fields for the expiration date
const monthInput = document.querySelector('input[placeholder="MM"]');
const yearInput = document.querySelector('input[placeholder="YY"]');
// This selects the CVC input field (the 3-digit security code on the back of the card)
const cvcInput = document.querySelector('input[placeholder="e.g. 123"]');

// Select the elements on the card display that we'll update in real-time as the user types
// We use nth-child selectors to precisely target elements based on their position in the parent container
// cardNumberDisplay uses nth-child(2) because it's the second div child of the card-main element
// In the HTML structure, the first child is the card logo image, and the second is the div containing the card number
const cardNumberDisplay = document.querySelector(".card-main div:nth-child(2)");
// cardNameDisplay uses nth-child(3) p:first-child to target the name element
// The third child of card-main is a div containing both the name and date, and we want the first paragraph in that div
const cardNameDisplay = document.querySelector(
  ".card-main div:nth-child(3) p:first-child"
);
// Similarly, cardDateDisplay selects the second paragraph (expiry date) in that same third div
const cardDateDisplay = document.querySelector(
  ".card-main div:nth-child(3) p:last-child"
);
// cardCvcDisplay selects the div inside the card-back element that displays the CVC number
const cardCvcDisplay = document.querySelector(".card-back div");

// Select elements for the success/complete state that appears after form submission
// We need the form element again to hide it when showing the success state
const formElement = document.querySelector("form");
// The complete state is hidden by default with the 'hidden' class in HTML
const completeState = document.querySelector(".text-center");
// We need the continue button to add a click event listener to reset the form
const continueButton = completeState.querySelector("button");

// ==================== HELPER FUNCTIONS ==================== //

// Function to create an error message element for validation errors
// This approach allows us to dynamically create consistent error elements throughout the form
function createErrorElement() {
  // document.createElement creates a new DOM element - in this case, a paragraph element
  const error = document.createElement("p");
  // className property sets CSS classes on the element
  // 'text-red-500' makes the text red (using Tailwind CSS)
  // 'text-xs' makes the font size extra small
  // 'mt-1' adds a small margin to the top (margin-top: 0.25rem)
  error.className = "text-red-500 text-xs mt-1";
  // Return the configured element so it can be used and appended to the DOM
  return error;
}

// Function to format the card number with spaces after every 4 digits for readability
// Credit card numbers are traditionally displayed in groups of 4 digits
function formatCardNumber(value) {
  // First, remove all spaces from the input
  let digitsOnly = "";
  for (let i = 0; i < value.length; i++) {
    // Check if the character is NOT a space
    if (value[i] !== " ") {
      digitsOnly += value[i];
    }
  }

  // Now add spaces after every 4 characters
  let formattedNumber = "";
  for (let i = 0; i < digitsOnly.length; i++) {
    // Add the current character to our formatted number
    formattedNumber += digitsOnly[i];

    // If the position is divisible by 4 (we've added 4 characters)
    // AND it's not the end of the string, add a space
    if ((i + 1) % 4 === 0 && i !== digitsOnly.length - 1) {
      formattedNumber += " ";
    }
  }

  return formattedNumber;
}

// ==================== EVENT LISTENERS ==================== //

// Add an 'input' event listener to the card name input field
// The input event fires every time the value of the input changes (when user types or deletes)
// We use an anonymous function as the event handler
cardNameInput.addEventListener("input", function () {
  // 'this' refers to the element that triggered the event (cardNameInput)
  // this.value gets the current text value that the user has typed
  // The || operator provides a fallback value 'Jane Appleseed' if this.value is empty
  // textContent sets the text of the target element (updates what's displayed on the card)
  cardNameDisplay.textContent = this.value || "Jane Appleseed";
});

// Add an input event listener to the card number input for real-time formatting and validation
cardNumberInput.addEventListener("input", function () {
  // First, check if there's already an error message and remove it
  // parentElement gives us the parent container of the input
  // querySelector looks for any element with the class 'text-red-500' (our error message styling)
  const errorElement = this.parentElement.querySelector(".text-red-500");
  // If an error element exists, remove it from the DOM to avoid duplicate errors
  if (errorElement) errorElement.remove();

  // Validate that the input contains only numbers and spaces
  // We'll check each character one by one
  let hasInvalidCharacters = false;
  for (let i = 0; i < this.value.length; i++) {
    const char = this.value[i];
    // Check if the character is not a digit (0-9) and not a space
    if (!(char >= "0" && char <= "9") && char !== " ") {
      hasInvalidCharacters = true;
      break; // Exit the loop early if we found an invalid character
    }
  }

  if (hasInvalidCharacters) {
    // If invalid characters are found, create and show an error message
    const error = createErrorElement();
    error.textContent = "Wrong format, numbers only";
    // appendChild adds the error element as the last child of the parent element
    this.parentElement.appendChild(error);
    // Add red border to visually indicate the error state
    this.classList.add("border-red-500");
  } else {
    // If input is valid, remove any error styling
    this.classList.remove("border-red-500");

    // Format the card number input with spaces using our helper function
    this.value = formatCardNumber(this.value);

    // Get the formatted card number or use default if empty
    const digits = this.value || "0000 0000 0000 0000";
    // Split the string by spaces to get an array of 4-digit groups
    const parts = digits.split(" ");

    // Clear the existing display before adding new content
    // innerHTML = '' removes all child elements of the target element
    cardNumberDisplay.innerHTML = "";

    // Loop through the 4 parts of the card number (or less if the input is incomplete)
    // This creates a separate <p> element for each 4-digit group of the card number
    for (let i = 0; i < 4; i++) {
      // Create a new paragraph element for each 4-digit group
      const p = document.createElement("p");
      // Set the text content to the corresponding part from our array
      // If that part doesn't exist (e.g., user hasn't typed that far yet), use '0000'
      p.textContent = parts[i] || "0000";
      // Add this paragraph to the card number display
      // This builds up the card number display with 4 separate elements for styling purposes
      cardNumberDisplay.appendChild(p);
    }
  }
});

// Add input event listeners to month and year inputs
// When either of these changes, we need to update the expiry date on the card
monthInput.addEventListener("input", function () {
  // Call our helper function that updates the display with both month and year values
  updateExpiryDate();
});

yearInput.addEventListener("input", function () {
  // Same helper function call, ensuring consistent formatting in both cases
  updateExpiryDate();
});

// Helper function that combines month and year values and updates the display
// This is used by both month and year input event listeners to avoid duplicate code
function updateExpiryDate() {
  // Get the current values from both inputs, or use '00' as fallback if empty
  const month = monthInput.value || "00";
  const year = yearInput.value || "00";
  // Format the date as MM/YY and update the card display
  // Template literals (`${var}`) allow us to easily insert variables into strings
  cardDateDisplay.textContent = `${month}/${year}`;
}

// Add input event listener to the CVC input field
cvcInput.addEventListener("input", function () {
  // Update the CVC display on the back of the card with the input value
  // Or use '000' as a default if the input is empty
  cardCvcDisplay.textContent = this.value || "000";
});

// ==================== FORM VALIDATION ==================== //

// Add a submit event listener to the form to validate all inputs before submission
form.addEventListener("submit", function (e) {
  // preventDefault() stops the form from submitting normally (page refresh)
  // This allows us to handle the submission with JavaScript instead
  e.preventDefault();
  // Start with assuming the form is valid and set to false if any validation fails
  let isValid = true;

  // Check if card name is empty using trim() to remove whitespace
  // trim() ensures that spaces-only input is considered empty
  if (!cardNameInput.value.trim()) {
    // If empty, mark the form as invalid
    isValid = false;
    // Call our helper function to show the error message under the input
    highlightError(cardNameInput, "Can't be blank");
  }

  // Check card number for emptiness and non-numeric characters
  if (!cardNumberInput.value.trim()) {
    isValid = false;
    highlightError(cardNumberInput, "Can't be blank");
  } else {
    // Check for non-numeric characters again (in case they were added after initial input)
    let hasInvalidChars = false;
    for (let i = 0; i < cardNumberInput.value.length; i++) {
      const char = cardNumberInput.value[i];
      // Check if character is not a digit and not a space
      if (!(char >= "0" && char <= "9") && char !== " ") {
        hasInvalidChars = true;
        break;
      }
    }

    if (hasInvalidChars) {
      isValid = false;
      highlightError(cardNumberInput, "Wrong format, numbers only");
    }
  }

  // Check if month field is empty
  if (!monthInput.value.trim()) {
    isValid = false;
    highlightError(monthInput, "Can't be blank");
  }

  // Check if year field is empty
  if (!yearInput.value.trim()) {
    isValid = false;
    highlightError(yearInput, "Can't be blank");
  }

  // Check if CVC field is empty
  if (!cvcInput.value.trim()) {
    isValid = false;
    highlightError(cvcInput, "Can't be blank");
  }

  // If all validations pass (isValid is still true), show the success/complete state
  if (isValid) {
    // Hide the form by changing its display style property to 'none'
    formElement.style.display = "none";
    // Show the success message by removing the 'hidden' class
    // classList.remove modifies the element's class list to remove a specific class
    completeState.classList.remove("hidden");
  }
});

// Helper function to show error messages under input fields
// This centralizes our error handling logic for consistency
function highlightError(inputElement, message) {
  // Get the parent element to append the error message to
  // This ensures the error appears directly below the input field
  const parent = inputElement.parentElement;

  // Check if there's already an error message to avoid duplicates
  const existingError = parent.querySelector(".text-red-500");
  // If an error exists, remove it before adding a new one
  if (existingError) existingError.remove();

  // Create a new error element with our helper function
  const error = createErrorElement();
  // Set the error message text
  error.textContent = message;
  // Add red border to the input to visually indicate the error
  inputElement.classList.add("border-red-500");
  // Add the error message to the DOM, below the input
  parent.appendChild(error);
}

// ==================== RESET FUNCTIONALITY ==================== //

// Add click event listener to the Continue button in the success state
// This allows users to return to the form after a successful submission
continueButton.addEventListener("click", function () {
  // Show the form again by changing its display style to 'block'
  formElement.style.display = "block";
  // Hide the success message by adding the 'hidden' class back
  completeState.classList.add("hidden");

  // Reset all form inputs to their initial empty state
  // The reset() method is a built-in method of the form element
  // It resets all form elements to their default values
  form.reset();

  // Reset the card display elements back to their default values
  // Set the card name back to the default placeholder
  cardNameDisplay.textContent = "Jane Appleseed";

  // Clear the card number display
  cardNumberDisplay.innerHTML = "";

  // Rebuild the default card number display with four segments of '0000'
  // forEach is an array method that executes a function for each element
  ["0000", "0000", "0000", "0000"].forEach((num) => {
    // For each 4-digit group, create a new paragraph element
    const p = document.createElement("p");
    // Set its text to the current group ('0000')
    p.textContent = num;
    // Add it to the card number display
    cardNumberDisplay.appendChild(p);
  });

  // Reset expiry date and CVC to default values
  cardDateDisplay.textContent = "00/00";
  cardCvcDisplay.textContent = "000";
});