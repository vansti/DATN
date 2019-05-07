import React, { Component } from 'react';
import { Table,InputGroupAddon,NavLink,  InputGroup, InputGroupText, Input, FormGroup, Label,Button } from 'reactstrap';
import { getExercisePoint,getExercise, getSubmission,getSubmissionExer, download, addPoint } from '../../actions/exerciseActions';
import {getUsers} from '../../actions/userActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
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
  const line = {


    labels: ['1', '2', '3', '4', '5', '6', '7','8','9','10'],
    datasets: [
      {
        label: 'Điểm',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40,30,55,78],
      },
    ],
  };
  const options = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false
  }
  

class ScoreExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
          studentExercise :[],
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
        this.props.getExercisePoint(this.props.match.params.exerciseId);
        this.props.getUsers(this.props.match.params.courseId);
        //this.props.getSubmission(this.props.match.params.exerciseId);
        this.props.getSubmissionExer(this.props.match.params.exerciseId)
        console.log(this.state)
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.studentExercise) {
          this.setState({
            studentExercise: nextProps.studentExercise,

          })
      }
        if (nextProps.exercises) {
            this.setState({
                title: nextProps.exercises.exercise.title,

            })
        }
        if (nextProps.users.users) {
          nextProps.users.users.students.map(user =>{
            return user.point = 0
          })
          this.setState({
            students: nextProps.users.users.students
          })

        }
        if (nextProps.submission.submission) {
            this.setState({
                submission: nextProps.submission.submission
            })

        }
        if (nextProps.submission.submission) {
          this.setState({
              submission: nextProps.submission.submission
          })

      }
        
        console.log(this.state);
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

    onChangePoint(userId,e){
      this.state.students.map(user => {
        if(user._id.toString() === userId.toString())
          return user.point = e.target.value;
        
        return user;
        
      })
      this.setState({
        students: this.state.students
      })
      console.log(this.state.students)
      // var newPoint = {
      //   exerciseId: this.props.match.params.exerciseId,
        
      //   studentExercise: []
      // };
  
      // newPoint.studentExercise = JSON.parse(JSON.stringify(this.state.students));
      // newPoint.studentExercise.map(student => {
      //   student.userId = student._id
      //   delete student._id
      //   delete student.name
      //   delete student.photo
      //   return student
      // })
   
      // this.props.addPoint(newPoint);
      //this.setState({isLoading: true})
      
    }
    submit = () => {
      
      var newPoint = {
        exerciseId: this.props.match.params.exerciseId,
        
        studentExercise: []
      };
  
      newPoint.studentExercise = JSON.parse(JSON.stringify(this.state.students));
      newPoint.studentExercise.map(student => {
        student.userId = student._id
        delete student._id
        delete student.name
        delete student.photo
        return student
      })
   
      this.props.addPoint(newPoint);
      //this.setState({isLoading: true})
      this.setState({isShowSuccess: true})
  
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
        if(this.state.students === '')
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
                            <Input size="1" type="number"
                            value={user.point}
                            onChange={this.onChangePoint.bind(this, user._id)}/>
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
            ListSubmission = <tr><td></td><td>Chưa có bài nộp !!!</td></tr>
        }
        else{
        ListSubmission = this.state.submission.map((submission, index) =>
            
             <tr style={styles.styleSub} key={index} >
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
        <Button color="primary" onClick={this.submit}>Thay đổi</Button>{' '}
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Chấm điểm thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <div></div>
        <Card>
            <CardHeader>
              Biểu đồ điểm
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Line data={line} options={options} />
              </div>
            </CardBody>
          </Card>
        </div>
        
        )
    }
}

ScoreExercise.propTypes = {
    
    getExercise: PropTypes.func.isRequired,
    getExercisePoint: PropTypes.func.isRequired,
    exercises: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    submission: PropTypes.object.isRequired,
    addPoint: PropTypes.func.isRequired,
    studentExercise: PropTypes.object.isRequired

};

const mapStateToProps = state => ({

    exercises: state.exercises,
    users: state.users,
    submission: state.submission,
    studentExercise: state.studentExercise

});

export default connect(mapStateToProps, {getExercisePoint,getExercise,getUsers, getSubmission,getSubmissionExer, download,addPoint})(ScoreExercise); 
