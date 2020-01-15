import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    height: 140,
    width: 100,
  },
  control: {
      padding: theme.spacing(2),
  },
}));

function Board() {
    const [spacing, setSpacing] = React.useState(2);
    const classes = useStyles();
  return (
      <Grid item xs={12}>
        <Grid container justify="center" spacing={spacing} >
          {[0, 1, 2, 3, 4, 5].map(value => (
            <Grid key={value} item>
              <Paper className={classes.paper}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
  );
}

export default Board;
