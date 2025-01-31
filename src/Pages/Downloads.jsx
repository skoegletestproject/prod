import React, { useEffect, useState } from "react";
import { Container, TextField, Button, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function Downloads() {
    // Function to format date in DD-MM-YYYY format
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const today = formatDate(new Date());
    const [selectedDevice, setSelectedDevice] = useState("Device-1");
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [fromTime, setFromTime] = useState("01:00:00");
    const [toTime, setToTime] = useState("23:00:00");
    const [videoData, setVideoData] = useState([]);
    const [errors, setErrors] = useState({});
    const [filter, setFilter] = useState({ selectedDevice, fromDate, toDate, fromTime, toTime });

    const validateInputs = () => {
        const newErrors = {};
        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split("-");
            return new Date(`${year}-${month}-${day}`);
        };

        if (parseDate(fromDate) > parseDate(toDate)) newErrors.date = "From Date cannot be later than To Date.";
        if (fromTime > toTime) newErrors.time = "From Time cannot be later than To Time.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFilter = () => {
        if (validateInputs()) {
            const data = { selectedDevice, fromDate, toDate, fromTime, toTime };
            setFilter(data);
        }
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch(
                    `https://server2-getfromdatabase.onrender.com/find?fromdate=${filter.fromDate}&todate=${filter.toDate}&fromtime=${filter.fromTime}&totime=${filter.toTime}&divisename=${filter.selectedDevice}`
                );
                if (!response.ok) throw new Error("Failed to fetch videos");
                const data = await response.json();
                setVideoData(data.sort((a, b) => a.fromtime.localeCompare(b.fromtime)));
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchVideos();
    }, [filter]);

    return (
        <Container>
            <TextField select label="Select Device" value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} fullWidth margin="normal">
                <MenuItem value="Device-1">Device 1 - Kochi Car</MenuItem>
            </TextField>
            <TextField
                type="date"
                label="From Date"
                InputLabelProps={{ shrink: true }}
                value={fromDate.split("-").reverse().join("-")} // Convert to YYYY-MM-DD for input field
                onChange={(e) => setFromDate(formatDate(e.target.value))}
                fullWidth
                margin="normal"
                error={!!errors.date}
                helperText={errors.date}
            />
            <TextField
                type="date"
                label="To Date"
                InputLabelProps={{ shrink: true }}
                value={toDate.split("-").reverse().join("-")} // Convert to YYYY-MM-DD for input field
                onChange={(e) => setToDate(formatDate(e.target.value))}
                fullWidth
                margin="normal"
            />
            <TextField
                type="time"
                label="From Time"
                InputLabelProps={{ shrink: true }}
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                fullWidth
                margin="normal"
                error={!!errors.time}
                helperText={errors.time}
            />
            <TextField
                type="time"
                label="To Time"
                InputLabelProps={{ shrink: true }}
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleFilter} fullWidth>Filter</Button>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Filename</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>From Time</TableCell>
                            <TableCell>To Time</TableCell>
                            <TableCell>Video</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {videoData.map((video) => (
                            <TableRow key={video._id}>
                                <TableCell>{video.filename}</TableCell>
                                <TableCell>{video.date}</TableCell>
                                <TableCell>{video.fromtime}</TableCell>
                                <TableCell>{video.totime}</TableCell>
                                <TableCell><a href={video.url} target="_blank" rel="noopener noreferrer">Download</a></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
