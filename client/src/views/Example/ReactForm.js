import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form'
import { connect } from 'react-redux'
import { addTestQuiz } from '../../actions/testQuizAction'
import axios from 'axios';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)



class ReactFormExample extends Component {
  submit = values => {
    axios
    .post('/api/test/add-quiz', values)
    .then(res => {
      console.log(res.data);
    })
    .catch(err =>{
      throw new SubmissionError(err);
    });
  }

  render() {
    const { error, handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit(this.props.addTestQuiz)}>
        <Field
          name="testTitle"
          type="text"
          component={renderField}
          label="Tiêu đề"
        />
        <Field
          name="testSynopsis"
          type="text"
          component={renderField}
          label="testSynopsis"
        />
        <Field
          name="courseId"
          type="text"
          component={renderField}
          label="courseId"
        />
        {error && <strong>{error}</strong>}
        <div>
          <button type="submit" disabled={submitting}>
            Log In
          </button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>
            Clear Values
          </button>
        </div>
      </form>
    )
  }
}

ReactFormExample = reduxForm({
  form: 'reactFormExample' // a unique identifier for this form
})(ReactFormExample)

const selector = formValueSelector('textForm');

ReactFormExample = connect(
  state => {
  const testTitle = selector(state, 'testTitle');
  return { testTitle: testTitle }
  }, { addTestQuiz })(ReactFormExample);
export default ReactFormExample;
