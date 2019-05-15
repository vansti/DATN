import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//action
import { getDetailQuiz } from '../../actions/testQuizAction';
//component
import { Card, CardHeader, CardBody, FormGroup, Alert } from 'reactstrap';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';

class QuizDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizDetail: {},
      loading: true
    };
  }

  componentDidMount = () => {
    this.props.getDetailQuiz(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {

    const { quizDetail, loading } = nextProps.testQuiz
    if(!isEmptyObj(quizDetail))
      this.setState({ 
        quizDetail,
        loading 
      });
    this.setState({
      loading 
    });  
  }

  render(){
    const { quizDetail, loading } = this.state;
    return  (
      <div className="animated fadeIn">
      {
        loading
        ?
        <ReactLoading type='bars' color='#05386B' />
        :
        <Card>
          <CardHeader>
            {quizDetail.title}
          </CardHeader>
          <CardBody>
            {
              quizDetail.listQuiz.map(quiz =>
                <FormGroup tag="fieldset" key={quiz._id}>
                  <legend>{ quiz.question }</legend>
                  <ul>
                  {
                    quiz.answers.map((answer, key) => {
                      return (
                        <li key={key}>
                          {answer}
                        </li>
                      )
                    })
                  }
                  </ul>
                  <Alert color="success">
                    Câu số {quiz.correctAnswer} là câu trả lời đúng !
                  </Alert>
                </FormGroup>
              )
            }
          </CardBody>
        </Card>
      }
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getDetailQuiz: bindActionCreators(getDetailQuiz, dispatch)
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz  
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetail);