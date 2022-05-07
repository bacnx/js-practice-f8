function Validator(selector) {
  const _this = this
  const ruleInputs = {}

  /**
   * Hàm kiểm tra các rule
   * Nếu không có lỗi -> trả về undefined
   * Nếu có lỗi -> trả về error message
   */
  const validates = {
    require: function(value) {
      return value ? undefined : 'Vui lòng nhập trường này!'
    },
    email: function(value) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      return regex.test(value) ? undefined : 'Trường này phải là email'
    },
    min: function(min) {
      return function(value) {
        return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`
      }
    }
  }

  /**
   * ruleInputs lưu theo định dạng
   * - Mỗi key là một input là một mảng các function
   * - các function nhận vào 1 value và trả về error message hoặc không có lỗi
   */

  const formElement = document.querySelector(selector)
  if (formElement) {
    
    const inputElements = formElement.querySelectorAll('input[name][rules]')
    if (inputElements) {
      Array.from(inputElements).forEach(function(input) {
        ruleInputs[input.name] = []
  
        // thêm các rules của 1 input vào ruleInputs
        input.getAttribute('rules').split(' ').forEach(rule => {
          let ruleFunc = validates[rule]
          if (rule.includes(':')) {
            const ruleValue = rule.split(':')
            ruleFunc = validates[ruleValue[0]](ruleValue[1])
          }
          ruleInputs[input.name].push(ruleFunc)
        })

        // Xử lý các sự kiện của input
        input.onblur = handleValidate
        input.oninput = handleClearValidate
      })
    }

    function handleValidate(event) {
      let errorMessage
      ruleInputs[event.target.name].some(ruleFunc => {
        errorMessage = ruleFunc(event.target.value)
        if (errorMessage) {
          return true
        }
      })

      if (errorMessage) {
        const formGroupElement = event.target.closest('.form-group')
        const formMessageElement = formGroupElement.querySelector('.form-message')
        
        formMessageElement.innerText = errorMessage
        formGroupElement.classList.add('invalid')
      }

      return !errorMessage
    }

    function handleClearValidate(event) {
      const formGroupElement = event.target.closest('.form-group')
      const formMessageElement = formGroupElement.querySelector('.form-message')

      if (formGroupElement.classList.contains('invalid')) {
        formMessageElement.innerText = ''
        formGroupElement.classList.remove('invalid')
      }
    }

    function getFormData() {
      let values = {}
      const inputElements = formElement.querySelectorAll('input[name][rules]')
      if (inputElements) {
        Array.from(inputElements).forEach(input => {
          values[input.name] = input.value
        })
      }
      return values
    }

    // xử lý khi submit form
    const submitElement = formElement.querySelector('.form-submit')
    if (submitElement) {
      formElement.onsubmit = (e) => {
        e.preventDefault()
        let isFormValid = true

        const inputElements = formElement.querySelectorAll('input[name][rules]')
        if (inputElements) {
          Array.from(inputElements).forEach(input => {
            if (!handleValidate({ target: input })) {
              isFormValid = false
            }
          })
        }

        if (isFormValid) { 
          if (typeof _this.onSubmit === 'function') {
            _this.onSubmit(getFormData())
          } else {
            formElement.submit()
          }
        }
      }
    }
  }
}