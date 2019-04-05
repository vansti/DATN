import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//action
import { getListQuiz } from '../../actions/testQuizAction';
//component
import Quiz from 'react-quiz-component';
import ReactLoading from 'react-loading';
class QuizDetailPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount = () => {
    this.props.getListQuiz();
  }

  onCompleteAction = (obj) => {
    console.log(obj);
    // YOUR LOGIC GOES HERE
  }
  render(){
    var testQuiz = '';
    if(this.props.testQuiz.listTestQuiz != null)
    {
      testQuiz= this.props.testQuiz.listTestQuiz.find(test => test._id.toString() === this.props.match.params.id);
      var formatData = {
        "quizTitle": testQuiz.quizTitle,
        "quizSynopsis": testQuiz.description,
        "questions": testQuiz.listQuiz,
      }
      return  <Quiz quiz={formatData} shuffle={true} onComplete={this.onCompleteAction}/>
    }
    else {
      return <ReactLoading type='bars' color='#05386B' height={100} width={50} />
    }
    
  }
}

QuizDetailPage.propTypes = {
  getListQuiz : PropTypes.func.isRequired,
  testQuiz: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getListQuiz: bindActionCreators(getListQuiz, dispatch)
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetailPage);