import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";

interface Column <T> {
    header: string;
    render: (item: T) => React.ReactNode;
}

interface TableDisplayProps <T> {
 items: T [];
 columns: Column <T>[];
getRowKey: (item: T) => string | number;
}

function TableDisplay <T> ({items, columns, getRowKey}: TableDisplayProps <T>) {
return (
    <TableContainer>
        <Table>
        <TableHead>
            <TableRow>
                {columns.map ((col) => 
                   ( <TableCell key={col.header}></TableCell>)
                    )}
            </TableRow>
        </TableHead>
        <TableBody>
            {items.map ((item) => (
                <TableRow key={getRowKey(item)}>
                {columns.map((col) => (
                    <TableCell key={col.header}>{col.render(item)}</TableCell>
                ))}
                </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
);
}

export default TableDisplay;