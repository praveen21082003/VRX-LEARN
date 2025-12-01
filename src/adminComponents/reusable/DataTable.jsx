

function DataTable() {
    const tableHeader = ["User Id", "Course ID", "Enrollment Id", "Enrolled"];
    return (
        <table className="admintabletag">
            <thead className="tableheader">
                {
                    tableHeader.map((th) => {
                            <th key={th} className="tableth">{th}</th>
                    })
                }

            </thead>
        </table>
    )
}


export default DataTable;