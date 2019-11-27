var deserializeForm = function (url, questionList, clauseList, callback) {
  importFormJSON(url, function (data) {
    createQuestions(data.questions, questionList)
    createClauses(data.clauses, clauseList)
    callback()
  })
}

var importFormJSON = function (url, callback) {
  var request = new XMLHttpRequest()
  request.open('GET', url, true)

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText)
      callback(data)
    }
  }
  request.send()
}

var createQuestions = function (questions, list) {
  questions.forEach(function (question) {
    var legend = document.createElement('legend')
    legend.innerText = question.question

    var fieldset = document.createElement('fieldset')
    fieldset.appendChild(legend)

    question.options.forEach(function (option) {
      createOption(option, question, fieldset)
    })

    var newQuestion = document.createElement('li')
    newQuestion.appendChild(fieldset)
    newQuestion.setAttribute('id', formatQuestionID(question.id))

    if (question.hidden === true) {
      newQuestion.setAttribute('data-hidden-question', true)
    }

    list.appendChild(newQuestion)
  })
}

var createOption = function (option, question, fieldset) {
  var label = document.createElement('label')
  label.setAttribute('for', option.id)

  var labelText = document.createElement('span')
  labelText.innerText = option.label

  var input = document.createElement('input')
  input.setAttribute('id', option.id)

  if (question.type === 'checkbox') {
    input.setAttribute('type', 'checkbox')
  } else {
    input.setAttribute('type', 'radio')
  }

  input.setAttribute('name', question.id)

  if (option.actions.question !== null) {
    input.setAttribute('data-question', formatQuestionID(option.actions.question))
  }
  if (option.actions.clause !== null) {
    input.setAttribute('data-clause', formatClauseID(option.actions.clause))
  }

  label.appendChild(input)
  label.appendChild(labelText)
  fieldset.appendChild(label)
}

var createClauses = function (clauses, list) {
  for (let [id, body] of Object.entries(clauses)) {
    var newClause = document.createElement('li')

    newClause.innerHTML = body
    newClause.setAttribute('id', 'c_' + id)

    list.appendChild(newClause)
  }
}

// We have to wrap the IDs with an alphabetical character to start, otherwise
// an id which starts with a number will break (due to limitations with CSS
// selectors).
//
var formatQuestionID = function (id) {
  return 'q_' + id
}

var formatClauseID = function (id) {
  return 'c_' + id
}
