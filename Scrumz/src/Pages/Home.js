import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Card, CardActionArea, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Home() {
  const classes = useStyles();

  function FormRow() {
    return (
        <React.Fragment>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Button href = '/board' >
              <Card>
                Content of the card
              </Card>
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Button href = '/board' >
              <Card>
                Content of the card
              </Card>
            </Button>
          </Paper>
        </Grid>
      </React.Fragment>
    );
}

  return (
    <div className={classes.root}>
       <h1>Your Board</h1>  
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          <FormRow />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <FormRow />
        </Grid>
      </Grid>
    </div>
  );
}