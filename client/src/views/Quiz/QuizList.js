import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//package
import PropTypes from 'prop-types';
import {Card, Table, CardBody,  CardHeader, Button} from 'reactstrap';
import Moment from 'react-moment'; 
import isEmptyObj from '../../validation/is-empty';
import ReactLoading from 'react-loading';
//action
import { getListQuiz } from '../../actions/testQuizAction';
//reducer
// Component

class QuizListPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount = () => {
    this.props.getListQuiz();
  }

  jumpToDetail = testQuizid => {
    this.props.history.push('/test/quiz/' + testQuizid)
  }
  
  render () {
    let list = '';
    let listTestQuiz = this.props.testQuiz.listTestQuiz;
    if(this.props === null)
      {
        list = <tr><td></td><td></td><td ><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td><td></td></tr>
      } else if(isEmptyObj(listTestQuiz)) {
          list = <tr><td></td><td></td><td >Bạn hiện không có bài kiểm tra nào</td><td></td></tr>
        } else {
          list = listTestQuiz.map(testQuiz=>
            <tr key={testQuiz._id} onClick={this.jumpToDetail.bind(this, testQuiz._id)} className="changeCursor">
              <td>
                {testQuiz.title}
              </td>
              <td>
                {testQuiz.time}
              </td>
              {/* <td>
                <div>{course.mainteacher}</div>
              </td> */}
              <td>
                <Moment format="DD/MM/YYYY">
                  {testQuiz.deadline}
                </Moment>
              </td>
              <td className="text-right">
                <Button onClick={this.toggle} color="primary">Làm bài</Button>
              </td>
            </tr>
          )
        }
    return <div className="animated fadeIn">
    <Card>
      <CardHeader>
        Danh sách bài kiểm tra trắc nghiệm
      </CardHeader>
      <CardBody>
        <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
          <thead className="thead-light">
            <tr>
              {/* <th className="text-center"><i className="fa fa-book"></i></th> */}
              <th>Tên Bài kiểm tra</th>
              <th>Thời gian</th>
              <th>Deadline</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  </div>;
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
