import React, { Component } from 'react';
import {Card, Table, CardBody,  CardHeader, CardFooter} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurentCourse } from '../../actions/courseActions';
import ModalEnroll from '../../components/ModalEnroll';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';

