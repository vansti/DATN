import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//action
import { getListQuiz } from '../../actions/testQuizAction';
//component
import SweetAlert from 'react-bootstrap-sweetalert';
import {Modal, ModalBody} from 'reactstrap';
import QuizTest from '../../components/Quiz/QuizTest';
import ReactLoading from 'react-loading';
class QuizTestPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      timeout: 300,
      isShowSuccess: false,
      isLoading: false,
    };
  }

  componentDidMount = () => {
    this.props.getListQuiz();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.success.data)
    // if (!nextProps.success.data) {
    //   this.setState({isShowSuccess: true, isLoading: false})
    // }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
  }

  render(){
    var testQuiz = '';
    if(this.props.testQuiz.listTestQuiz != null)
    {
      testQuiz = this.props.testQuiz.listTestQuiz.find(test => test._id.toString() === this.props.match.params.id);
      return  (
        <div>
          <QuizTest quizTest={testQuiz} shuffle={true}/>
          <SweetAlert
            success
            confirmBtnText="OK"
            confirmBtnBsStyle="success"
            title="Thêm bài kiểm tra thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
          </SweetAlert>
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
    else {
      return <ReactLoading type='bars' color='#05386B' height={100} width={50} />
    }
    
  }
}

QuizTestPage.propTypes = {
  getListQuiz : PropTypes.func.isRequired,
  testQuiz: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getListQuiz: bindActionCreators(getListQuiz, dispatch)
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz,
  success: state.success, 
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizTestPage);