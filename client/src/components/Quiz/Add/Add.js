import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import {Row, Modal, ModalBody, Alert, Card, CardBody, CardFooter, CardHeader, Col, Fade, Button, Collapse, Form, FormGroup, InputGroupAddon, Label, InputGroup, InputGroupText, Input} from 'reactstrap';


import { addTestQuiz } from '../../../actions/testQuizAction';

import range from 'lodash/range'
// import validate from './validate';

class TestQuizForm extends Component {
  renderInputFieldInline = ({ input, label, type, id='', meta: { touched, error } }) => (
    <FormGroup row>
      <Label for={id} sm={2}>{label}: </Label>
      <Col sm={10}>
      <InputGroup className="input-prepend">
        <InputGroupAddon addonType="prepend">
          <InputGroupText><i className="fa fa-book"></i></InputGroupText>
        </InputGroupAddon>
        <Input {...input} type={type} placeholder={label} id={id}/>
      </InputGroup>
        {touched && error && <span>{error}</span>}
      </Col>
    </FormGroup>
  );
  
  renderInputFieldHaveRemove = ({ input, label, type, id='', fields, index, meta: { touched, error }}) => (
    <Col sm={8}>
      <InputGroup className="input-prepend">
        <InputGroupAddon addonType="prepend">
          <InputGroupText><i className="fa fa-book"></i></InputGroupText>
        </InputGroupAddon>
        <Input {...input} type={type} placeholder={label} id={id}/>
      </InputGroup>
      {touched && error && <span>{error}</span>}
    </Col>
  );

  renderSelectField = ({ input, label, id, meta: { touched, error }, children }) => (
    <FormGroup row>
      <Label for={id} sm={2}>{label}: </Label>
      <Col sm={10}>
      <InputGroup className="input-prepend">
        <InputGroupAddon addonType="prepend">
          <InputGroupText><i className="fa fa-book"></i></InputGroupText>
        </InputGroupAddon>
        <Input {...input} type="select" placeholder={label} id={id}>
          {children}
        </Input>
      </InputGroup>
      {touched && error && <span>{error}</span>}
      </Col>
    </FormGroup>
  );
  
   renderSelectQuestionTypeField = ({ input, label, type, meta: { touched, error }, children }) => (
    <div>
      <label>{label}</label>
      <div>
        <select {...input} >
          {children}
        </select>
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );
  
   renderTextAnswers = ({ fields, question, meta: { touched, error } }) => (
    <div>
      {fields.map((answer, index) => (
        <FormGroup row key={index}>
          <Label for="" sm={2}>{`Câu trả lời ${index + 1}`}: </Label>
          <Field
            name={answer}
            type="text"
            component={this.renderInputFieldHaveRemove}
            label={`Câu trả lời ${index + 1}`}
          />
          <Col sm={2}>
            <Button type="button" onClick={() => fields.remove(index)}>Xóa câu trả lời</Button>
          </Col>
        </FormGroup>
      ))}
      <Button type="button" onClick={() => fields.push()}>Thêm câu trả lời</Button>
        <FormGroup>
          <Field
          name={`${question}.correctAnswer`}
          component={this.renderSelectField}
          label="Câu trả lời đúng"
        >
          <option value="">Please select correct answer</option>
            {fields.map((answer, index) => (
              <option key={index+1} value={index+1}>{`Answer #${index + 1}`}</option>
            ))}
        </Field>
        </FormGroup>
    
      {error && <li className="error">{error}</li>}
    </div>
  );
  
  renderQuizzes = ({ fields, meta: { touched, error, submitFailed } }) => (
    <FormGroup>
        {(touched || submitFailed) && error && <span>{error}</span>}
      {fields.map((quiz, index) => (
        <div key={index}>
          <h4>Câu hỏi {index + 1}: </h4>
          <Field
            name={`${quiz}.question`}
            type="text"
            component={this.renderInputFieldInline}
            label="Câu hỏi"
          />
          <Field
            name={`${quiz}.questionType`}
            component={this.renderSelectField}
            label="Loại câu hỏi"
          >
            <option value="">Vui lòng chọn</option>
            <option value="text">Văn bản</option>
            <option value="photo">Hình ảnh</option>
          </Field>
          <FieldArray name={`${quiz}.answers`} component={this.renderTextAnswers} question={quiz} />
          <Field
            name={`${quiz}.explanation`}
            type="textarea"
            component={this.renderInputFieldInline}
            label="Explanation"
          />
          <FormGroup>
            <Button color="danger" onClick={() => fields.remove(index)}>Xóa Câu hỏi</Button>
          </FormGroup>
        </div>
      ))}
      <Button color="success" type="button" onClick={() => fields.push({})}>Thêm câu hỏi</Button>
    </FormGroup>
  );
  render() {

  const { handleSubmit, courses, pristine, reset, submitting } = this.props;
    return (
      <Form name="text-form" onSubmit = {handleSubmit}>
        <Field
          name="testTitle"
          type="text"
          component={this.renderInputFieldInline}
          label="Tiêu đề bài kiểm tra"
        />
        <Field
          name="testSynopsis"
          type="textarea"
          component={this.renderInputFieldInline}
          label="Tóm tắt bài kiểm tra"
        />
        <Field
          name="courseId"
          type="text"
          component={this.renderSelectField}
          label="Khóa học"
        >
        <option value="">Mời bạn chọn khóa học</option>
             {courses.map((course, index) => (
               <option key={course._id} value={course._id}>{course.title}</option>
             ))}
        </Field>
	      <FieldArray name="quizzes" component={this.renderQuizzes} />
	      <FormGroup>
	        <Button color="primary" type="submit" disabled={submitting}>Nộp bài</Button>{' '}
	        <Button color="secondary" type="button" disabled={pristine || submitting} onClick={reset}>
	          Xóa tất cả
	        </Button>
	      </FormGroup>
	    </Form>
    );
  }
}

TestQuizForm = reduxForm({
  form: 'testQuizForm',
  // validate
})(TestQuizForm);

const selector = formValueSelector('textForm');

TestQuizForm = connect(
  state => {
    const quizzes = selector(state, 'quizzes');
    const questionType = quizzes && quizzes.map(quiz => quiz.questionType);

    return { questionType: questionType }
  }
)(TestQuizForm)

export default TestQuizForm;
