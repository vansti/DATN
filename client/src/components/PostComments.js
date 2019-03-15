import React, { Component,Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input,Row,Col } from 'reactstrap';
import { connect } from 'react-redux';
import { addComment, getComments } from '../actions/exerciseActions';
import PropTypes from 'prop-types';
import isEmptyObj from '../validation/is-empty';
import ReactLoading from 'react-loading';
import Moment from 'react-moment'; 

const styles = {
  bigAvatar: {
    width: 35,
    height: 35,
    margin: 'auto',
    borderRadius:50
  }
}
class PostComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text:'',
      large: false,
      errors: {},
      isLoading: false
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(nextProps) {
    
    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.data === "Bình luận của bạn đã được gửi") {
      this.setState({
        isLoading: false
      })
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const commentData = {
      text: this.state.text
    };

    this.props.addComment(commentData,this.props.exercise._id);
    this.setState({
      text:'',
      isLoading: true
    });
  }

  onOpenModal = e => {
    e.preventDefault();

    this.props.getComments(this.props.exercise._id);
    this.setState({
      large: !this.state.large,
    });
  }


  render() {
    const exercise = this.props.exercise
    var cexercise = this.props.comments.comments
    console.log(cexercise)
    var CommentList = '';
    var ModalButton = '';
    if(cexercise === null)
    {
      CommentList = <ReactLoading type='bars' color='#05386B' height={100} width={50} />
      ModalButton = <Button block color="ghost-dark" onClick={this.onOpenModal}>{exercise.comments.length} bình luận</Button>  
    }else{
      if(exercise._id === cexercise._id)
      {
        ModalButton = <Button block color="ghost-dark" onClick={this.onOpenModal}>{cexercise.comments.length} bình luận</Button>
      }else{
        ModalButton = <Button block color="ghost-dark" onClick={this.onOpenModal}>{exercise.comments.length} bình luận</Button>  
      }
      
      if(cexercise.comments.length === 0)
      {
        CommentList = <b>Không có bình luận nào</b>
      }else{
        var comments = cexercise.comments
        CommentList = comments.map(comment=>
          <Fragment key={comment._id}>
            <Row >
              <Col sm="1">
                <img src={comment.userPhoto} alt="avatar" style={styles.bigAvatar}/>
              </Col>
              <Col>
                <b>{comment.userName}</b>
                <small style={{marginLeft:20, color:'#A8A8A8'}}>
                  <Moment format="HH:mm [ngày] DD [thg] MM, YYYY">
                    {comment.created}
                  </Moment>
                </small>
                <br/>
                {
                  comment.text.split('\n').map((itemChild, key) => {
                    return <span key={key}>{itemChild}<br/></span>
                  })
                }
              </Col>
            </Row>
            <br/>
          </Fragment>
          )
      }
    }
    return (
      <Fragment>
        {ModalButton}
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-lg'>
          <ModalHeader  toggle={this.toggleLarge}>Bình luận về bài tập</ModalHeader>
          <ModalBody style={{overflowY:'scroll', height:400}}>
            {CommentList}
          </ModalBody>
          <ModalFooter >
            <Input type="textarea" name="text" value={this.state.text} onChange={this.onChange} placeholder="Bình luận ..." />
            <Button className="btn-lg" onClick={this.onSubmit} style={{height:55}} color="primary"><i className="fa fa-paper-plane" aria-hidden="true"></i></Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang gửi bình luận</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

PostComments.propTypes = {
  addComment: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success,
  comments: state.comments
});

export default connect(mapStateToProps, { addComment, getComments })(PostComments);  