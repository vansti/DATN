import React, { Component } from 'react';
import {Card, CardBody} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';




class ApproveStudent extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>

          </CardBody>
        </Card>
      </div>
    )
  }
}

ApproveStudent.propTypes = {

};

const mapStateToProps = state => ({

});
export default connect(mapStateToProps, { })(ApproveStudent); 