type SuccessProps = {
  readonly hidden: boolean;
  readonly onEdit: () => void;
  readonly titleRef: (element: HTMLHeadingElement) => void;
};

export function Success(props: SuccessProps) {
  return (
    <div
      class="signup-success"
      hidden={props.hidden}
      role="status"
      aria-atomic="true"
    >
      <p class="signup-success-mark" aria-hidden="true">
        ✓
      </p>
      <h3 class="signup-success-title" tabindex="-1" ref={props.titleRef}>
        You're on the roster
      </h3>
      <p class="signup-success-copy">
        Game-day emails for your teams will land at your chosen time, only on
        days they play.
      </p>
      <p class="signup-success-copy">
        Change your mind later? Sign up again with the same email and your new
        picks replace the old ones.
      </p>
      <button class="btn btn-secondary" type="button" onClick={props.onEdit}>
        Edit my picks
      </button>
    </div>
  );
}
