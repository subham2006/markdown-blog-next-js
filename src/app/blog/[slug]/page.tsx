import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { useEffect } from 'react';

export async function generateStaticParams() {
  const directoryPath = path.join(process.cwd(), 'src/app/blog');
  const files = fs.readdirSync(directoryPath).filter(file => {
    return fs.statSync(path.join(directoryPath, file)).isFile() && file.endsWith('.mdx');
  });

  return files.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }));
}

function extractHeaders(markdownContent: string) {
  const headerRegex = /^(#{2,6})\s+(.*)/gm;
  const headers = [];
  let match;

  while ((match = headerRegex.exec(markdownContent)) !== null) {
    headers.push({
      level: match[1].length, // Number of '#' characters indicates the header level
      text: match[2],
      id: match[2].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    });
  }

  return headers;
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'src/app/blog', `${slug}.mdx`);
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { content, data: frontmatter } = matter(markdownWithMeta);

  // Extract headers from the markdown content
  const headers = extractHeaders(content);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{frontmatter.title || slug}</h1>

      {/* Displaying the extracted headers as a Table of Contents */}
      {headers.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Table of Contents</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            {headers.map((header, index) => (
              <li key={index} style={{ marginLeft: `${(header.level - 1) * 20}px` }}>
                <a href={`#${header.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {header.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
        <ReactMarkdown
          components={{
            h2: ({node, ...props}) => <h2 id={props.children.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} {...props} />,
            h3: ({node, ...props}) => <h3 id={props.children.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} {...props} />,
            h4: ({node, ...props}) => <h4 id={props.children.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} {...props} />,
            h5: ({node, ...props}) => <h5 id={props.children.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} {...props} />,
            h6: ({node, ...props}) => <h6 id={props.children.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
