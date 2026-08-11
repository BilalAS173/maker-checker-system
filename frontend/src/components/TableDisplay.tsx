import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from "@mui/material";

export interface Column <T> {
    header: string;
    render: (item: T, index: number) => React.ReactNode;
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
                  <TableCell key={col.header}> {col.header} </TableCell>
                    )}
            </TableRow>
        </TableHead>
        <TableBody>
            {items.map ((item, index) => (
                <TableRow key={getRowKey(item)}>
                {columns.map((col) => (
                    <TableCell key={col.header}>{col.render(item, index)}</TableCell>
                ))}
                </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
);
}

export default TableDisplay;