import React, {Component} from "react";  // eslint-disable-line no-unused-vars

export default class PostTemplate extends Component {
  render() {
    const {entry} = this.props;
    const {fields} = entry;

    return (
      <main className="content">
        <article>
          <h1>
            {fields.title.value}
          </h1>
          <div>
            {fields.body.preview}
          </div>
        </article>
      </main>
    );
  }
}
