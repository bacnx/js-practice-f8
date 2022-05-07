function Validator({ selectors, rules, onSubmit }) {
  const formElement = document.querySelector(selectors.form)

  const selectorRules = {}

  function validate(formGroupElement, rule) {
    const inputElement = formElement.querySelector(rule.selector)
    const messageElement = formGroupElement.querySelector(selectors.formMessage)
    const inputValue = inputElement.value
    
    let errorMessage

    for (ruleTest of selectorRules[rule.selector]) {
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = ruleTest(
            formElement.querySelector(rule.selector + ':checked')
          )
          break
        default:
          errorMessage = ruleTest(inputValue)
      }
      if (errorMessage) break
    }

    if (errorMessage) {
      formGroupElement.classList.add('invalid')
      messageElement.innerText = errorMessage
    } else {
      formGroupElement.classList.remove('invalid')
      messageElement.innerText = ''
    }

    return !errorMessage
  }
  
  if (formElement) {
    formElement.onsubmit = function(e) {
      e.preventDefault()
      let isFormValid = true

      rules.forEach((rule) => {
        const inputElement = formElement.querySelector(rule.selector)
        const formGroupElement = inputElement.closest(selectors.formGroup)
        const isValid = validate(formGroupElement, rule)

        if (!isValid) isFormValid = false
      })

      if (isFormValid) {
        if (typeof onSubmit === 'function') {
          const formInputs = formElement.querySelectorAll('[name]')
          const formValues = Array.from(formInputs).reduce(function(values, input) {
            switch (input.type) {
              case 'radio':
                if (input.checked) {
                  values[input.name] = input.value
                }
                break
              case 'checkbox':
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = []
                }
                if (input.checked) {
                  values[input.name].push(input.value)
                }
                break
              case 'file':
                values[input.name] = input.files
                break
              default:
                values[input.name] = input.value
            }
            
            return values
          }, {})

          onSubmit(formValues)
        } else {
          formElement.submit()
        }
      }
    }

    rules.forEach((rule) => {
      const inputElements = formElement.querySelectorAll(rule.selector)

      Array.from(inputElements).forEach(inputElement => {
        const formGroupElement = inputElement.closest(selectors.formGroup)
  
        if (selectorRules[rule.selector]) {
          selectorRules[rule.selector].push(rule.test)
        } else {
          selectorRules[rule.selector] = [rule.test]
        }
    
        inputElement.onblur = function() {
          validate(formGroupElement, rule)
        }
    
        inputElement.oninput = function() {
          const messageElement = formGroupElement.querySelector(selectors.formMessage)
    
          formGroupElement.classList.remove('invalid')
          messageElement.innerText = ''
        }
      })
    })
  }
}

// Define rules
Validator.isRequired = function(selector, message) {
  return {
    selector: selector,
    test: function(value) {
      if (!value) {
        return message || 'Vui lòng điền vào trường này'
      }
    }
  }
}

Validator.isEmail = function(selector, message) {
  return {
    selector: selector,
    test: function(value) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      return regex.test(value) ? undefined : message || 'Email không hợp lệ'
    }
  }  
}

Validator.minLength = function(selector, min, message) {
  return {
    selector: selector,
    test: function(value) {
      return value.length >= min ? undefined : message || `Độ dài phải tối thiểu ${min} ký tự`
    }
  }  
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function(value) {
      return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'    
    }
  }  
}