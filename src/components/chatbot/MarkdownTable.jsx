import React from 'react'

const MarkdownTable = ({ headers, rows }) => {
  return (
    <table className="table-auto border border-collapse border-gray-400 w-full my-2">
        <thead>
            <tr>
                {headers.map((header, i) => (
                    <th key={i} className="border border-gray-300 px-3 py-1 bg-gray-100">{header}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((row, i) => (
                <tr key={i}>
                    {row.map((cell, j) => (
                        <td key={j} className="border border-gray-300 px-3 py-1">{cell}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default MarkdownTable

