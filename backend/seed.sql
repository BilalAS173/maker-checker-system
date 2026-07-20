INSERT INTO users (employee_id, password, name) VALUES
('C001', 'checker123', 'David'), ('M001', 'maker123', 'Ali');

INSERT INTO projects (project_name) VALUES 
('XYZ'),
( 'ABC' );

INSERT INTO user_projects (user_id, project_id, role) VALUES 
(1,1 , 'maker'),
(1,2, 'checker'),
(2, 1, 'maker');

INSERT INTO requests (user_id, project_id, description, status) VALUES
(2, 1, 'Sick leave', 'Pending'),
(2, 1, 'Vacation', 'Approved');

