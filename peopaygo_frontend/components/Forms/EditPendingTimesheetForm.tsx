import handleDate from '@/helpers/handleDate';
import { useAddTimesheetNotesMutation } from '@/redux/api/timesheetApi';
import { Box, Button, TextField, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react'
import Swal from 'sweetalert2';

const EditPendingTimsheetForm = ({ timesheet, handleClose }: any) => {
  const [notes, setNotes] = useState(timesheet.notes || '')
  const [addTimesheetNotes, result] = useAddTimesheetNotesMutation();

  if (result.isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Notes added!",
      showConfirmButton: false,
      timer: 1500
    });
  } else if (result.isError) {
    Swal.fire({
      icon: "error",
      title: "Could not add notes...",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTimesheetNotes({ id: timesheet.id, notes })
    handleClose()
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Edit Timesheet</Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          disabled
          fullWidth
          label="Id"
          type="number"
          value={timesheet.id}
          margin="normal"
          style={{ marginRight: 10 }}
          name='id'
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          disabled
          fullWidth
          label="Status"
          type="text"
          value={timesheet.status}
          margin="normal"
          style={{ marginRight: 10 }}
          name='status'
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          disabled
          fullWidth
          label="Total Gross Pay"
          type="number"
          value={timesheet.totalGrossPay}
          margin="normal"
          name='totalGrossPay'
          InputLabelProps={{ shrink: true }}
          required
        />
      </div>
      <TextField
        label="Notes"
        type="text"
        value={notes}
        fullWidth
        margin="normal"
        name='notes'
        onChange={(e) => setNotes(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
      />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          disabled
          fullWidth
          label="Created Date"
          type="text"
          value={handleDate(timesheet.createdAt)}
          margin="normal"
          style={{ marginRight: 10 }}
          name='createdAt'
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          disabled
          fullWidth
          style={{ marginRight: 10 }}
          label="Updated Date"
          type="text"
          value={handleDate(timesheet.updated_at)}
          margin="normal"
          name='updated_at'
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          disabled
          label="Start Date"
          type="date"
          fullWidth
          value={timesheet.startDate}
          margin="normal"
          name='startDate'
          InputLabelProps={{ shrink: true }}
          required
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          disabled
          fullWidth
          label="End Date"
          type="date"
          value={timesheet.endDate}
          name='endDate'
          style={{ marginRight: 10 }}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        />
        <TextField
          disabled
          fullWidth
          label="Check Date"
          type="date"
          value={timesheet.checkDate}
          name='checkDate'
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        // sx={{
        //   svg: { color, backgroundColor: color },
        //   input: { color, backgroundColor: color },
        //   label: { color, backgroundColor: color },

        // }}
        />
      </div>
      <Box paddingY='10px' display='flex' justifyContent='flex-end' alignItems='center'>
        <Button type="submit" variant="contained" color="success">Add Note</Button>
      </Box>
    </form>
  )
}

export default EditPendingTimsheetForm;
