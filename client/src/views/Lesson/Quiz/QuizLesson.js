import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//action
import { getDetailQuiz } from '../../../actions/testQuizAction';
//component
import SweetAlert from 'react-bootstrap-sweetalert';
import { Modal, ModalBody } from 'reactstrap';
import QuizTest from './QuizTest';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../../validation/is-empty';

class QuizLesson extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizDetail: {},
      loading: true,
      timeout: 300,
      isShowSuccess: false,
      isLoading: false,
      alert: '',
      typeAlert: '',
    };
  }

  componentDidMount = () => {
    this.props.getDetailQuiz(this.props.match.params.quizId);
  }

  componentWillReceiveProps(nextProps) {
    let alert = '';
    let typeAlert = '';
    if(nextProps.success.data !== undefined && nextProps.success.data !== this.props.success.data) {
      if (nextProps.success.data.message === 'success') {
        alert = 'Số điểm của bạn là: ' + nextProps.success.data.data + 'điểm';
        typeAlert = 'success';
      } else {
        typeAlert = 'error';
        alert = nextProps.success.data.data;
      }
      this.setState({isShowSuccess: true, isLoading: false, alert: alert, typeAlert: typeAlert});
    }

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

  static contextTypes = {
    router: () => null
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.context.router.history.goBack();
  }

  render(){
    const { loading, quizDetail } = this.state;
    return  (
      <div>
        {
          loading
          ?
          <ReactLoading type='bars' color='#05386B' />
          :
          <QuizTest quizTest={quizDetail} shuffle={true}/>
        }
        {
          this.state.typeAlert === 'success' ?
          (<SweetAlert
            success
            confirmBtnText="Quay lại"
            confirmBtnBsStyle='success'
            title={ this.state.alert }
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            >
          </SweetAlert>) : 
          (
            <SweetAlert
              danger
              confirmBtnText="Quay lại"
              confirmBtnBsStyle='danger'
              title={ this.state.alert }
              show={this.state.isShowSuccess}
              onConfirm={this.hideAlertSuccess.bind(this)}
              >
            </SweetAlert>
          )
        }
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thêm bài kiểm tra</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

QuizLesson.propTypes = {
  getDetailQuiz : PropTypes.func.isRequired,
  testQuiz: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getDetailQuiz: bindActionCreators(getDetailQuiz, dispatch)
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz,
  success: state.success, 
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizLesson);