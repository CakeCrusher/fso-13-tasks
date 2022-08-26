create table blogs (
  id serial primary key,
  author text,
  url text not null,
  title text not null,
  likes integer default 0
);
insert into blogs (author, url, title) values ('john', 'http://john.com', 'Johns Blog');
insert into blogs (url, title) values ('http://anonymous.com', 'Anonymous Blog');
