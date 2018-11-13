import React, {Component} from "react";  // eslint-disable-line no-unused-vars

export default class PostTemplate extends Component {
  render() {
    const {entry, widgetFor} = this.props;

    return (
      <main className="content">
        <article>
          <h1>
            {entry.getIn("data", "title")}
          </h1>
          <div>
            {widgetFor("body")}
          </div>
        </article>
      </main>
    );
  }
}
