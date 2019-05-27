import React, { Component, Fragment } from 'react';
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
  
  toQuizDetail = testQuizid => {
    this.props.history.push('/quiz/quiz-detail/' + testQuizid)
  }

  render () {
    const { loading, listTestQuiz } = this.state
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
              <Fragment>
                {
                  listTestQuiz.length === 0
                  ?
                  <h3>Chưa có bài kiểm tra trắc nghiệm</h3>
                  :
                  <Table hover responsive bordered>
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
                              {testQuiz.time} phút
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                }
              </Fragment>
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
