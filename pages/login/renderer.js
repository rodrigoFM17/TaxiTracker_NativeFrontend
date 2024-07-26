
const API_USERS_URL = "https://taxitracker-api-users.freemyip.com"


document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    const confirmButton = document.querySelector("#confirmButton")
    const buttons = document.querySelectorAll("button[name='digit']")
    const eraseButton = document.querySelector("#deleteButton")
    const modal = document.querySelector("#modal")
    const accpetButton = document.querySelector("#acceptButton")
    
    let pin = ""

    const useModal = (msg) => {
      modal.classList.toggle("hidden")
      message.innerHTML = msg
      inputs.forEach(input => input.value = "")
      pin = ""
    }
    
    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value.length >= input.maxLength) {
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
            pin += inputs[index].value
          } else {
            pin += inputs[index].value
            button.focus()
          }
        }
      });
    });

    buttons.forEach(singleButton => {
      singleButton.addEventListener("click", (e) => {
        console.log(e.target)
        const digit = e.target.value
        inputs[pin.length].value = digit
        pin += digit
      })
    })

    confirmButton.addEventListener("click", async (e) => {
      e.preventDefault()
      console.log(pin)

      if(pin.length == 4) {
        try {
          await fetch(`${API_USERS_URL}/auth/drivers/${pin}`)
          .then(res => res.json())
          .then(data => {
            if(data.status == "success"){
              console.log(data)
              window.loader.setDriverId(data.data.id)
              window.loader.loadMain()
            } else{
              useModal("pin incorrecto")
            }
    
          })
        } catch {
          useModal("no es posible conectarse a los servidores de TaxiTracker")
        }
      } else 
        useModal("el pin es de 4 digitos")
    })

    eraseButton.addEventListener("click", () => {
      if(pin.length > 0){
        inputs[pin.length - 1].value = ""
        pin = pin.substring(0,pin.length -1)
        console.log(pin)
      } else {

      }
    })

    accpetButton.addEventListener("click", () => {
      modal.classList.toggle("hidden")
    })

    
  });
  
