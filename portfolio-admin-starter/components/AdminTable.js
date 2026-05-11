'use client';

export default function AdminTable({ title, rows, columns, onDelete }) {
  return (
    <section>
      <h2>{title}</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}<th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => <td key={column}>{String(row[column] ?? '')}</td>)}
              <td><button onClick={() => onDelete(row.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
