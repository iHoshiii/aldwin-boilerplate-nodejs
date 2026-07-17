import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Assignment as TaskIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';
import { toast } from 'react-toastify';
import { useTasks } from '../hooks';
import { tasksService } from '../services';

const Tasks = () => {
  const [statusFilter, setStatusFilter] = React.useState('');
  const [priorityFilter, setPriorityFilter] = React.useState('');

  const { tasks, isLoading, refresh } = useTasks({
    status: statusFilter || undefined,
  });

  // Client-side priority filter (the hook exposes status filtering; priority is filtered here)
  const filteredTasks = priorityFilter
    ? tasks.filter((t) => t.priority === priorityFilter)
    : tasks;

  const statusColors = {
    TODO: 'default',
    IN_PROGRESS: 'primary',
    REVIEW: 'warning',
    DONE: 'success',
  };

  const priorityColors = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'error',
    URGENT: 'error',
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksService.update(taskId, { status: newStatus });
      toast.success('Task status updated successfully');
      refresh();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksService.delete(taskId);
        toast.success('Task deleted successfully');
        refresh();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading tasks...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          <TaskIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            toast.info('New task form - to be implemented');
          }}
          sx={{
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          New Task
        </Button>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="REVIEW">Review</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="URGENT">Urgent</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tasks Grid */}
      <Grid container spacing={3}>
        {filteredTasks.map((task) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={task.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                    {task.title}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => toast.info('Edit task - to be implemented')}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {task.description && (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {task.description}
                  </Typography>
                )}

                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={task.status.replace('_', ' ')}
                    color={statusColors[task.status]}
                    size="small"
                  />
                  <Chip
                    label={task.priority}
                    color={priorityColors[task.priority]}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  Due: {formatDate(task.dueDate)}
                </Typography>

                {task.assignee && (
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Assigned to: {task.assignee.firstName} {task.assignee.lastName}
                  </Typography>
                )}

                {task.project && (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Project: {task.project.name}
                  </Typography>
                )}

                {/* Status Update Buttons */}
                <Box display="flex" gap={1} flexWrap="wrap">
                  {task.status !== 'TODO' && (
                    <Button size="small" variant="outlined" onClick={() => handleStatusChange(task.id, 'TODO')}>
                      To Do
                    </Button>
                  )}
                  {task.status !== 'IN_PROGRESS' && (
                    <Button size="small" variant="outlined" onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}>
                      In Progress
                    </Button>
                  )}
                  {task.status !== 'REVIEW' && (
                    <Button size="small" variant="outlined" onClick={() => handleStatusChange(task.id, 'REVIEW')}>
                      Review
                    </Button>
                  )}
                  {task.status !== 'DONE' && (
                    <Button size="small" variant="outlined" color="success" onClick={() => handleStatusChange(task.id, 'DONE')}>
                      Done
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTasks.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first task to get started
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Tasks;
