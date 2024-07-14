
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    const button = document.querySelector("#login-button")
    
    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value.length >= input.maxLength) {
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          } else {
            button.focus()
          }
        }
      });
    });

    button.addEventListener('click', () => {
      window.loader.loadMain()
    })

    
  });
  