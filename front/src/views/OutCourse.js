import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { Col, Container, Row } from 'reactstrap';
import { repNotifyMail, clearSuccess } from '../actions/userActions';
import logo from '../assets/img/e-icon.png'

class OutCourse extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {

    const repData = {
      replyMail: {
        chosen: 'Rời khỏi khóa học'
      }
    }

    this.props.repNotifyMail(this.props.match.params.userId, this.props.match.params.courseId, repData)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === 'Đã phản hồi mail thành công') {
      this.setState({ isLoading: false })
      this.props.clearSuccess()
    }
  }

  render() {
    const { isLoading } = this.state
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            {
              isLoading
              ?
              <ReactLoading type='bars' color='#05386B' />
              :
              <Col md="6">
                <img src={logo} alt='Logo' height="150" width="150" />
                <div style={{textAlign: 'center', fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold'}}>
                  Cảm ơn bạn, yêu cầu hủy ghi danh của bạn đã được gửi về Trung Tâm, mời bạn đến Trung Tâm để được tư vấn và hoàn tiền
                </div>         
              </Col>
            }
          </Row>
        </Container>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  success: state.success
});

export default connect(mapStateToProps, { repNotifyMail, clearSuccess })(OutCourse);
