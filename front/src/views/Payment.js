import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import ReactLoading from 'react-loading';
import { enrollCourse, getCourseInfo, clearSuccess } from '../actions/courseActions';
import { withRouter } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

class Payment extends Component {
  constructor() {
    super();
    this.state = {
      isShowSuccess: false,
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.success.mes === 'Ghi danh thành công vào khóa học') {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess()
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getCourseInfo(this.props.match.params.courseId);
  }
  
  render() {
    const onSuccess = (payment) => {
      const paymentData = {
        paymentMethod: 'Thanh toán trực tuyến',
        paymentDetail:{
          recipient_name: payment.address.recipient_name,
          line1: payment.address.line1,
          city: payment.address.city,
          email: payment.email,
          payerID: payment.payerID
        }
      }
      this.setState({ isLoading : true })
      this.props.enrollCourse(this.props.match.params.courseId, paymentData);
    }

    const onCancel = (data) => {
      console.log('The payment was cancelled!', data);
    }

    const onError = (err) => {
      console.log("Error!", err);
    }

    let env = 'sandbox';
    let currency = 'USD'; 
    let total = Number(this.props.fee); 

    const client = {
        sandbox: 'AcQi8r9H-u1Ou8sLUQVOkc0YPUUqDMrOLqsi-adOXA2LOxhXaDtRACO-S0hqt5z0XQwyvsTQ_HbvrqMP',
        production: 'YOUR-PRODUCTION-APP-ID',
    }

    return (
      <div className="animated fadeIn">
        <PaypalExpressBtn env={env} client={client} currency={currency} total={total} onError={onError} onSuccess={onSuccess} onCancel={onCancel} />
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Ghi danh thành công vào khóa học"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  success: state.success
});

export default withRouter(connect(mapStateToProps, { enrollCourse, getCourseInfo, clearSuccess })(Payment));
