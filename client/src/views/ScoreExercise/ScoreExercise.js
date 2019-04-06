import React, { Component } from 'react';
import { Modal, ModalBody,Table,InputGroupAddon,NavLink,  InputGroup, InputGroupText, Input, FormGroup, Label,Button } from 'reactstrap';
import { getExercise, getSubmission,getSubmissionExer, download } from '../../actions/exerciseActions';
import {getUsers} from '../../actions/userActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
const styles = {
    styleSub: {
        flexDirection: 'row' ,
        justifyContent: 'flex-end',
        width:50

    },
    styleInfo:{
        width: 50,
    }
  }

class ScoreExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
          title:'',
          students:'',
          submission:'',
          isShowSuccess: false,
            isLoading: false
        };
    }
    toggle() {
        this.setState({
          modal: !this.state.modal,
        });
      }
    componentDidMount(){
        this.props.getExercise(this.props.match.params.exerciseId);
        this.props.getUsers(this.props.match.params.courseId);
        //this.props.getSubmission(this.props.match.params.exerciseId);
        this.props.getSubmissionExer(this.props.match.params.exerciseId)

    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.exercises) {
            this.setState({
                title: nextProps.exercises.exercise.title,
            })
        }
        if (nextProps.users.users) {
            this.setState({
                students: nextProps.users.users.students
            })

        }
        if (nextProps.submission.submission) {
            this.setState({
                submission: nextProps.submission.submission
            })

        }
        
        //console.log(this.state.submission);
    }
    download = (e) => {
        e.preventDefault();
        this.props.download(this.props.match.params.exerciseId, this.props.submission.submission);
      }
    onSubmit = e => {
        e.preventDefault();

        this.setState({isLoading: true});
        this.setState({isShowSuccess: true});
      }
    hideAlertSuccess(){
        this.setState({
          isShowSuccess: false,
          modal: false,
        })
      }
    render() {
        //console.log(this.props.match.params.courseId)
        var StudentList = '';
        var ListSubmission='';
        //const {submission} = this.props.submission.submission;
        //console.log(this.props.submission.submission);
        if(this.props.users.users === null)
        {
             StudentList = <tr><td></td><td><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td></tr>
        }
        else{
            //console.log(this.state.students);
            StudentList = this.state.students.map((user, index) =>
            <tr key={user._id}>
            
            <td style={styles.styleInfo}>                      
                <div className="avatar">
                <img src={user.photo} className="img-avatar" alt="" />
                </div>
            </td>
            <td style={styles.styleInfo}>{user.name}</td>
            <td style={styles.styleInfo}>
            <FormGroup>
                        <Label htmlFor="prependedInput">Điểm bài tập</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="icon-pencil"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input size="1" type="text"/>
                          </InputGroup>
                          
                        </div>
            </FormGroup>
            </td>
            
            
            </tr>
        )
        }
        if(this.state.submission === '')
        {
            ListSubmission = <tr><td></td><td><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td></tr>
        }
        else{
        ListSubmission = this.state.submission.map((submission, index) =>
            
             <tr style={styles.styleSub} >
             <td>
             {
                submission === ''
                ? <div>Chưa có bài nộp</div>
                :<NavLink href="#" onClick={this.download}>{submission}</NavLink>
              }    
             </td>
             
             </tr>
             
             
        )
        }
        return (
        <div className="animated fadeIn">
            {this.state.title}
        <Table >
            <tbody >
            {StudentList}
            {ListSubmission}
            
            </tbody>
        </Table>
        <Button color="primary" onClick={this.onSubmit}>Thay đổi</Button>{' '}
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Chấm điểm thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        
        </div>
        
        )
    }
}

ScoreExercise.propTypes = {
    
    getExercise: PropTypes.func.isRequired,
    exercises: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    submission: PropTypes.object.isRequired

};

const mapStateToProps = state => ({
    exercises: state.exercises,
    users: state.users,
    submission: state.submission


});

export default connect(mapStateToProps, {getExercise,getUsers, getSubmission,getSubmissionExer, download})(ScoreExercise); 
