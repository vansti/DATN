import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//package
import PropTypes from 'prop-types';
import { Card, Table, CardBody, CardHeader } from 'reactstrap';
// import Moment from 'react-moment'; 
// import isEmptyObj from '../../validation/is-empty';
import ReactLoading from 'react-loading';
//action
import { getListQuiz } from '../../actions/testQuizAction';
//reducer
// Component

class QuizListPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      listTestQuiz: [],
      loading: true
    }
  }

  componentDidMount = () => {
    this.props.getListQuiz();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.testQuiz) {
      const { listTestQuiz, loading } = nextProps.testQuiz
      if(listTestQuiz)
      {
        this.setState({
          listTestQuiz,
          loading
        })
      }

      this.setState({
        loading
      })
    }
  }

  // jumpToQuizTest = testQuizid => {
  //   this.props.history.push('/quiz/test/' + testQuizid)
  // }

  // jumpToQuizTestResult = testQuizid => {
  //   this.props.history.push('/quiz/test-result/' + testQuizid)
  // }

  // jumpToQuizExcercise = testQuizid => {
  //   this.props.history.push('/quiz/excercise/' + testQuizid)
  // }
  
  toQuizDetail = testQuizid => {
    this.props.history.push('/quiz/quiz-detail/' + testQuizid)
  }

  render () {
    const { loading, listTestQuiz } = this.state
    // let list = '';
    // let listTestQuiz = this.props.testQuiz.listTestQuiz;
    // if(this.props === null)
    //   {
    //     list = <tr><td></td><td></td><td ><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td><td></td></tr>
    //   } else if(isEmptyObj(listTestQuiz)) {
    //       list = <tr><td></td><td></td><td >Bạn hiện không có bài kiểm tra nào</td><td></td><td></td></tr>
    //     } else {
    //       list = listTestQuiz.map(testQuiz=>
    //         <tr key={testQuiz._id}  className="changeCursor">
    //           <td>
    //             {testQuiz.title}
    //           </td>
    //           <td>
    //             {testQuiz.time}
    //           </td>
    //           {/* <td>
    //             <div>{course.mainteacher}</div>
    //           </td> */}
    //           <td>
    //             <Moment format="DD/MM/YYYY">
    //               {testQuiz.deadline}
    //             </Moment>
    //           </td>
    //           <td className="text-right">
    //             <Button className="ml-2 mr-2" onClick={this.jumpToQuizExcercise.bind(this, testQuiz._id)} color="primary">Làm bài tập</Button>
    //             {
    //               testQuiz.hasSubQuiz ? 
    //               (<Button className="ml-2 mr-2" onClick={this.jumpToQuizTest.bind(this, testQuiz._id)} color="primary">Làm Kiểm tra</Button>) 
    //               :(<Button className="ml-2 mr-2" onClick={this.jumpToQuizTestResult.bind(this, testQuiz._id)} color="danger">Coi lại bài làm</Button>) 
    //             }
    //           </td>
    //         </tr>
    //       )
    //     }
    
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <b>Danh sách bài kiểm tra trắc nghiệm</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B' />
              :
              <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th>Tên Bài kiểm tra</th>
                  <th>Thời gian làm</th>
                </tr>
              </thead>
              <tbody>
                {
                  listTestQuiz.map(testQuiz=>
                    <tr key={testQuiz._id} className="changeCursor" onClick={this.toQuizDetail.bind(this, testQuiz._id)}>
                      <td>
                        {testQuiz.title}
                      </td>
                      <td>
                        {testQuiz.time}
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
            }
          </CardBody>
        </Card>
      </div>
    )
  }
}

QuizListPage.propTypes = {
  getListQuiz : PropTypes.func.isRequired,
  testQuiz: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getListQuiz: bindActionCreators(getListQuiz, dispatch)
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizListPage);
