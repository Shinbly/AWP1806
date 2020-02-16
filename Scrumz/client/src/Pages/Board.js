import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';

import Backlog from '../Assets/BacklogExemple.json'
import SprintBacklog from '../Assets/SprintBacklog.json'
import Todo from '../Assets/Todo.json'
import Doing from '../Assets/Doing.json'
import ToTest from '../Assets/ToTest.json'
import Done from '../Assets/Done.json'
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  colomn: {
    width: 170,
  },
  task: {
    paddingBlock : 10,
    backgroundColor : "lighblue",
    width: 145,
  },
  control: {
      padding: theme.spacing(4),
  },
}));

function Board() {
    const [spacing, setSpacing] = React.useState(2);
    const classes = useStyles();
  return (
      <Grid item xs={12}>
        <Grid container justify="center" spacing={spacing} >
          {[Backlog, SprintBacklog, Todo, Doing, ToTest, Done].map(value => (
            <Grid key={value} item>
              <Paper className={classes.colomn}>
                <h4>
                  {value.name}
                </h4>
                <Grid container justify="center" spacing={spacing}>
                  {value.tasks.map(task => (
                    <Paper elevation={6} className={classes.task}>
                      <h4>
                          {task.name}
                      </h4>
                      {task.description}
                     </Paper>
                  ))}
                </Grid>
                {(value.name == "Backlog")
                ?
                <Button>
                  +Add a Card
                </Button>
                :
                null}
              </Paper>

            </Grid>
          ))}
        </Grid>
      </Grid>
  );
}

export default Board;
