import React, { Component } from 'react';
import {  Row, Col, Container } from 'reactstrap';
import { connect } from 'react-redux';
import PostBox from './PostBox';
import PostList from './PostList';

class PostInCourse extends Component {
 
  render() {

    return (
      <Container>
        <Row>
          <Col>
            <PostBox/>
            <PostList/>
          </Col>
        </Row>
      </Container>
    )
  }
}

PostInCourse.propTypes = {

};

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { })(PostInCourse);  