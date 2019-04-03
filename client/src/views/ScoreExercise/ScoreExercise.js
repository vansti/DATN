import React, { Component } from 'react';
import { Table,InputGroupAddon,  InputGroup, InputGroupText, Input, FormGroup, Label,Button } from 'reactstrap';
import { getExercise, getSubmission, download } from '../../actions/exerciseActions';
import {getUsers} from '../../actions/userActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';

class ScoreExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
          title:'',
          students:''
        };
    }

    componentDidMount(){
        this.props.getExercise(this.props.match.params.exerciseId);
        this.props.getUsers(this.props.match.params.courseId);
        this.props.getSubmission(this.props.match.params.exerciseId);
        

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
    }

    render() {
        //console.log(this.props.match.params.courseId)
        var StudentList = '';
        const {submission} = this.props.submission.submission;
        //console.log(this.props.submission.submission);
        if(this.props.users.users === null)
        {
             StudentList = <tr><td></td><td><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td></tr>
        }
        else{
            //console.log(this.state.students);
            StudentList = this.state.students.map((user, index) =>
            <tr key={user._id}>
            <th>                      
                <div className="avatar">
                <img src={user.photo} className="img-avatar" alt="" />
                </div>
            </th>
            <td>{user.name}</td>
            <td>
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
            <td>
                <Label htmlFor="prependedInput">File bài nộp</Label>
                <div></div>
                {this.props.submission.submission}

            </td>
            </tr>
        )
        }
        
        return (
        <div className="animated fadeIn">
            {this.state.title}
        <Table responsive hover>
            <tbody>
            {StudentList}
            
            </tbody>
        </Table>
        <Button type="submit" color="primary" onClick={this.onSubmit}>Lưu thay đổi</Button>
        </div>
        
        )
    }
}

ScoreExercise.propTypes = {
    
    getExercise: PropTypes.func.isRequired,
    exercises: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    submission: PropTypes.object.isRequired,
    // Submission: PropTypes.object.isRequired

};

const mapStateToProps = state => ({
    exercises: state.exercises,
    users: state.users,
    submission: state.submission,
    // Submission: state.Submission


});

export default connect(mapStateToProps, {getExercise,getUsers, getSubmission, download})(ScoreExercise); 
